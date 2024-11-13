<?php

namespace App\Services;

use App\Services\DependencyManagerService;
use App\Repositories\DependencyManagerRepository;
use Illuminate\Support\Str;
use App\Models\Task;

class TaskService
{
    

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

        $task = $this->taskRepository->saveTask($task);
        $project = $this->projectRepository->projectDetails($projectId);
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
