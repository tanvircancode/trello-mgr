<?php

namespace App\Services;

use App\Services\DependencyManagerService;
use App\Repositories\DependencyManagerRepository;

class LabelService
{
    protected DependencyManagerService $dependencyManagerService;
    protected DependencyManagerRepository $dependencyManagerRepository;

    public function __construct(DependencyManagerService $dependencyManagerService, DependencyManagerRepository $dependencyManagerRepository)
    {
        $this->dependencyManagerService = $dependencyManagerService;
        $this->dependencyManagerRepository = $dependencyManagerRepository;
    }

    public function findLabelById($id)
    {
        return $this->dependencyManagerRepository->labelRepository->findById($id);
    }

    public function createLabel(array $labelData)
    {
        return $this->dependencyManagerRepository->labelRepository->storeLabel($labelData);
    }

    public function updateLabel($label, array $data)
    {
        return $this->dependencyManagerRepository->labelRepository->saveLabel($label, $data);
    }

    public function fetchLabelsOfATask($taskId)
    {
        $task = $this->dependencyManagerRepository->taskRepository->findById($taskId);
        $task->labels();
        return $task;
    }
}
