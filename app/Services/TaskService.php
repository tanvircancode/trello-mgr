<?php

namespace App\Services;

use App\Services\ResponseService;
use App\Services\UserService;
use App\Repositories\TaskRepository;
use App\Repositories\ProjectRepository;


class TaskService
{
    protected $taskRepository;
    protected $projectRepository;
    protected $responseService;
    protected $userService;

    public function __construct(TaskRepository $taskRepository, ProjectRepository $projectRepository, UserService $userService, ResponseService $responseService)
    {
        $this->taskRepository = $taskRepository;
        $this->projectRepository = $projectRepository;
        $this->responseService = $responseService;
        $this->userService = $userService;
    }

    public function createTask(array $taskData, $userId,  $listId)
    {
        $task = $this->taskRepository->createTaskWithRelations($taskData, $userId);

        $tasks = $this->projectRepository->getTasksByListId($listId);

        return $tasks;
    }

    public function findTaskById($id)
    {
        return $this->taskRepository->findById($id);
    }

    public function reorderTask($data)
    {
        $projectId = $data['project_id'];
        $listId = $data['list_id'];
        $start = $data['start'];
        $end = $data['end'];

        $tasks = $this->taskRepository->fetchTasksOfAList($listId);


        if ($start > $tasks->count() || $end > $tasks->count()) {
            return;
        }

        $tasksArray = $tasks->toArray();
    
        $movedTask = array_splice($tasksArray, $start, 1)[0];
        
        array_splice($tasksArray, $end, 0, [$movedTask]);
    
        $this->taskRepository->updatePosition($tasksArray);
    
        return true;
    }

    public function updateTask(array $data)
    {
        $taskId = $data['task_id'];

        $task = $this->findTaskById($taskId);

        if (!$task) {
            return $this->responseService->messageResponse('Task not found', false, 404);
        }

        $description = $data['description'];
        $projectId = $data['project_id'];
        $task->description = $description;

        $task = $this->taskRepository->saveTask($task);
        $project = $this->projectRepository->projectDetails($projectId);
        return $this->responseService->successProjectTaskResponse('Desription Updated Successfully', $project, $task, true, 200);
    }

    public function assignUserToTask(array $data)
    {
        $userId = $data['user_id'];

        $user = $this->userService->findUserById($userId);

        if (!$user) {
            return null;
        }

        $taskId = $data['task_id'];
        $task = $this->findTaskById($taskId);
        $this->taskRepository->attachUserToTask($task, $userId);

        return true;
    }

    public function fetchUsersOfTask($taskId)
    {
        $task = $this->findTaskById($taskId);
        $task->users();
        return $task;
    }

    public function removeUserFromTask(array $data)
    {
        $userId = $data['user_id'];

        $user = $this->userService->findUserById($userId);

        if (!$user) {
            return null;
        }

        $taskId = $data['task_id'];
        $task = $this->findTaskById($taskId);
        $this->removeSingleUserFromTask($task, $userId);

        return true;
    }

    public function removeSingleUserFromTask($task, $userId)
    {
        return $this->taskRepository->detachUserFromTask($task, $userId);
    }

    public function removeMembersFromTask($task, $tusers)
    {
        foreach ($tusers as $user) {
            $this->removeSingleUserFromTask($task, $user->id);
        }

        $this->taskRepository->deleteTask($task);
        return true;
    }
}
