<?php

namespace App\Services;
use App\Repositories\ChecklistItemRepository;

class ChecklistItemService
{
    protected $checklistItemRepository;

    public function __construct(ChecklistItemRepository $checklistItemRepository)
    {
        $this->checklistItemRepository = $checklistItemRepository;
    }

    public function findChecklistItemById($id)
    {
        return $this->checklistItemRepository->findById($id);
    }

    public function createChecklistItem(array $checklistItemData)
    {
        return $this->checklistItemRepository->storeChecklistItem($checklistItemData);
    }

    public function deleteChecklistItem($checklistItem)
    {
        return $this->checklistItemRepository->delete($checklistItem);
    }

    public function updateChecklistItemWithData($checklistItem, array $data)
    {
        return $this->checklistItemRepository->saveChecklistItem($checklistItem, $data);
    }
}
