<?php

namespace App\Services;


use App\Services\DependencyManagerService;
use App\Repositories\DependencyManagerRepository;

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

    public function updateTask(array $data)
    {
        $taskId = $data['task_id'];

        $task = $this->dependencyManagerRepository->taskRepository->findById($taskId);

        if (!$task) {
            return $this->dependencyManagerService->responseService->messageResponse('Task not found', false, 404);
        }

        $description = $data['description'];
        $projectId = $data['project_id'];
        $task->description = $description;

        $task = $this->dependencyManagerRepository->taskRepository->saveTask($task);
        $project = $this->dependencyManagerRepository->projectRepository->fetchDetailstWithProjectId($projectId);
        return $this->dependencyManagerService->responseService->successProjectTaskResponse('Desription Updated Successfully', $project, $task, true, 200);
    }
}
