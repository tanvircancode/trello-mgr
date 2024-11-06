<?php

namespace App\Repositories;

use App\Models\Checklist;

class ChecklistRepository
{
    protected $checklistModel;

    public function __construct(Checklist $checklistModel)
    {
        $this->checklistModel = $checklistModel;
    }

    public function findById($id)
    {
        return $this->checklistModel->find($id);
    }

    // public function saveChecklist(Checklist $checklist, array $data)
    // {
    //     // check later
    //     return $checklist->update($data);
    // }

    public function storeChecklist(array $data)
    {
        return $this->checklistModel->create($data);
    }

    public function delete(Checklist $checklist)
    {
        return $checklist->delete();
    }
    
    public function save(Checklist $checklist)
    {
        return $checklist->save();
    }
}
