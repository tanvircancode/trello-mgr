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

    public function createTask(array $taskData, $userId)
    {
        $task = $this->dependencyManagerRepository->taskRepository->createTaskWithRelations($taskData, $userId);
    }
}
