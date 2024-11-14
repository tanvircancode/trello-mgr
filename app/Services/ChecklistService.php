<?php

namespace App\Services;

use App\Repositories\ChecklistRepository;
use App\Repositories\TaskRepository;

class ChecklistService
{
    protected $checklistRepository;
    protected $taskRepository;

    public function __construct(TaskRepository $taskRepository, ChecklistRepository $checklistRepository)
    {
        $this->taskRepository = $taskRepository;
        $this->checklistRepository = $checklistRepository;
    }

    public function findChecklistById($id)
    {
        return $this->checklistRepository->findById($id);
    }

    public function createChecklist(array $checklistData)
    {
        return $this->checklistRepository->storeChecklist($checklistData);
    }

    public function updateChecklist($checklist)
    {
        return $this->checklistRepository->save($checklist);
    }

    public function deleteChecklist($checklist)
    {
        return $this->checklistRepository->delete($checklist);
    }

    public function fetchChecklistsOfATask($taskId)
    {
        return $this->taskRepository->findTaskWithRelation(['checklists', 'checklists.checklistitems'], $taskId);
    }
}
