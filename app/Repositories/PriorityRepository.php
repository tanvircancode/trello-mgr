<?php

namespace App\Repositories;

use App\Models\Priority;

class PriorityRepository
{
    protected $priorityModel;

    public function __construct(Priority $priorityModel)
    {
        $this->priorityModel = $priorityModel;
    }

    public function findById($id)
    {
        return $this->priorityModel->find($id);
    }

    public function savePriority(Priority $priority, array $data)
    {
        // check later
        return $priority->update($data);
    }

    public function storePriority(array $data)
    {
        return $this->priorityModel->create($data);
    }

    public function delete(Priority $priority)
    {
        return $priority->delete();
    }
    public function save(Priority $priority)
    {
        return $priority->save();
    }
}
