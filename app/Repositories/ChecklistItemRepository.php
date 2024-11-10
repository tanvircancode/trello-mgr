<?php

namespace App\Repositories;

use App\Models\ChecklistItem;

class ChecklistItemRepository
{
    protected $checklistItemModel;

    public function __construct(ChecklistItem $checklistItemModel)
    {
        $this->checklistItemModel = $checklistItemModel;
    }

    public function findById($id)
    {
        return $this->checklistItemModel->find($id);
    }

    public function storeChecklistItem(array $data)
    {
        return $this->checklistItemModel->create($data);
    }

    public function delete(ChecklistItem $checklistItem)
    {
        return $checklistItem->delete();
    }

    public function save(ChecklistItem $checklistItem)
    {
        return $checklistItem->save();
    }

    public function saveChecklistItem(ChecklistItem $checklistItem, array $data)
    {
        // check later
        return $checklistItem->update($data);
    }
}
