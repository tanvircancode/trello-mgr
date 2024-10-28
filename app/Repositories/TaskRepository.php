<?php

namespace App\Repositories;

use App\Models\Task;

class TaskRepository
{
    protected $taskModel;

    public function __construct(Task $taskModel)
    {
        $this->taskModel = $taskModel;
    }

    public function findById($id)
    {
        return $this->taskModel->find($id);
    }

    public function deleteUsersOfATask(Task $task)
    {
        return $task->users()->detach();
    }

    public function checkUserOfTask(Task $task, $userId)
    {
        return $task->users()->detach($userId);
    }

    public function deleteUserOfATask(Task $task)
    {
        return $task->users()->detach();
    }
}
