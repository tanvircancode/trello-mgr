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

    public function deleteChecklistItem($checklistItem)
    {
        return $this->dependencyManagerRepository->checklistItemRepository->delete($checklistItem);
    }

    public function updateChecklistItemWithData($checklistItem, array $data)
    {
        return $this->dependencyManagerRepository->checklistItemRepository->saveChecklistItem($checklistItem, $data);
    }
}
