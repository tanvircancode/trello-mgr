<?php

namespace App\Services;

use App\Services\DependencyManagerService;
use App\Repositories\DependencyManagerRepository;

class PriorityService
{
    protected DependencyManagerService $dependencyManagerService;
    protected DependencyManagerRepository $dependencyManagerRepository;

    public function __construct(DependencyManagerService $dependencyManagerService, DependencyManagerRepository $dependencyManagerRepository)
    {
        $this->dependencyManagerService = $dependencyManagerService;
        $this->dependencyManagerRepository = $dependencyManagerRepository;
    }

    public function findPriorityById($id)
    {
        return $this->dependencyManagerRepository->priorityRepository->findById($id);
    }

    public function createPriority(array $priorityData)
    {
        return $this->dependencyManagerRepository->priorityRepository->storePriority($priorityData);
    }

    public function updatePriority($priority, array $data)
    {
        return $this->dependencyManagerRepository->priorityRepository->savePriority($priority, $data);
    }
    public function deletePriority($priority)
    {
        return $this->dependencyManagerRepository->priorityRepository->delete($priority);
    }

    public function fetchPrioritiesOfATask($taskId)
    {
        $task = $this->dependencyManagerRepository->taskRepository->findById($taskId);
        $priorities =  $task->priorities;
        return $priorities;
    }

    public function fetchPrioritiesOfATaskNew($taskId)
    {
        $task = $this->dependencyManagerRepository->taskRepository->findById($taskId);
        $task->priorities();
        return $task;
    }

    public function changeSelectedPriority($priorities, $priorityId, $taskId)
    {
        if ($priorityId === 'null') {
            foreach ($priorities as $priority) {
                $priority->is_active = 0;
                $this->dependencyManagerRepository->priorityRepository->save($priority);
            }
            return true;
        }
    }
}
