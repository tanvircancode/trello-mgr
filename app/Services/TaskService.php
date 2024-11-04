<?php

namespace App\Services;

use App\Services\DependencyManagerService;
use App\Repositories\DependencyManagerRepository;
use Illuminate\Support\Str;
use App\Models\Task;

class TaskService
{
    protected DependencyManagerService $dependencyManagerService;
    protected DependencyManagerRepository $dependencyManagerRepository;

    public function __construct(DependencyManagerService $dependencyManagerService, DependencyManagerRepository $dependencyManagerRepository)
    {
        $this->dependencyManagerService = $dependencyManagerService;
        $this->dependencyManagerRepository = $dependencyManagerRepository;
    }

    public function createTask(array $taskData, $userId,  $listId)
    {
        $task = $this->dependencyManagerRepository->taskRepository->createTaskWithRelations($taskData, $userId);

        $tasks = $this->dependencyManagerRepository->projectRepository->getTasksByListId($listId);

        return $tasks;
    }

    public function findTaskById($id)
    {
        return $this->dependencyManagerRepository->taskRepository->findById($id);
    }

    public function updateTask(array $data)
    {
        $taskId = $data['task_id'];

        $task = $this->findTaskById($taskId);

        if (!$task) {
            return $this->dependencyManagerService->responseService->messageResponse('Task not found', false, 404);
        }

        $description = $data['description'];
        $projectId = $data['project_id'];
        $task->description = $description;

        $task = $this->dependencyManagerRepository->taskRepository->saveTask($task);
        $project = $this->dependencyManagerRepository->projectRepository->projectDetails($projectId);
        return $this->dependencyManagerService->responseService->successProjectTaskResponse('Desription Updated Successfully', $project, $task, true, 200);
    }

    public function assignUserToTask(array $data)
    {
        $userId = $data['user_id'];

        $user = $this->dependencyManagerService->userService->findUserById($userId);

        if (!$user) {
            return null;
        }

        $taskId = $data['task_id'];
        $task = $this->findTaskById($taskId);
        $this->dependencyManagerRepository->taskRepository->attachUserToTask($task, $userId);

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

        $user = $this->dependencyManagerService->userService->findUserById($userId);

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
        return $this->dependencyManagerRepository->taskRepository->detachUserFromTask($task, $userId);
    }

    public function removeMembersFromTask($task, $tusers) {
        foreach ($tusers as $user) {
            $this->removeSingleUserFromTask($task,$user->id);
        }
        
        $this->dependencyManagerRepository->taskRepository->deleteTask($task);
        return true;
    }
}
