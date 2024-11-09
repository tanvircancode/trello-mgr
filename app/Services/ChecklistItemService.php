<?php

namespace App\Services;

use App\Services\DependencyManagerService;
use App\Repositories\DependencyManagerRepository;

class ChecklistItemService
{
    protected DependencyManagerService $dependencyManagerService;
    protected DependencyManagerRepository $dependencyManagerRepository;

    public function __construct(DependencyManagerService $dependencyManagerService, DependencyManagerRepository $dependencyManagerRepository)
    {
        $this->dependencyManagerService = $dependencyManagerService;
        $this->dependencyManagerRepository = $dependencyManagerRepository;
    }

    public function findChecklistItemById($id)
    {
        return $this->dependencyManagerRepository->checklistItemRepository->findById($id);
    }

    public function createChecklistItem(array $checklistItemData)
    {
        return $this->dependencyManagerRepository->checklistItemRepository->storeChecklistItem($checklistItemData);
    }

    public function updateChecklistItem($checklist)
    {
        return $this->dependencyManagerRepository->checklistItemRepository->save($checklist);
    }

    public function deleteChecklistItem($checklist)
    {
        return $this->dependencyManagerRepository->checklistItemRepository->delete($checklist);
    }

    public function fetchChecklistItemsOfATask($taskId)
    {
        return $this->dependencyManagerRepository->taskRepository->findTaskWithRelation(['checklists', 'checklists.checklistitems'], $taskId);
    }
}