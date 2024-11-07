<?php

namespace App\Services;

use App\Services\DependencyManagerService;
use App\Repositories\DependencyManagerRepository;

class ChecklistService
{
    protected DependencyManagerService $dependencyManagerService;
    protected DependencyManagerRepository $dependencyManagerRepository;

    public function __construct(DependencyManagerService $dependencyManagerService, DependencyManagerRepository $dependencyManagerRepository)
    {
        $this->dependencyManagerService = $dependencyManagerService;
        $this->dependencyManagerRepository = $dependencyManagerRepository;
    }

    public function findChecklistById($id)
    {
        return $this->dependencyManagerRepository->checklistRepository->findById($id);
    }

    public function createChecklist(array $checklistData)
    {
        return $this->dependencyManagerRepository->checklistRepository->storeChecklist($checklistData);
    }

    public function updateChecklist($checklist)
    {
        return $this->dependencyManagerRepository->checklistRepository->save($checklist);
    }

    public function deleteChecklist($checklist)
    {
        return $this->dependencyManagerRepository->checklistRepository->delete($checklist);
    }

    public function fetchChecklistsOfATask($taskId)
    {
        return $this->dependencyManagerRepository->taskRepository->findTaskWithRelation(['checklists', 'checklists.checklistitems'], $taskId);
    }
}
