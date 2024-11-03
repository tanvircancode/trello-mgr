<?php

namespace App\Repositories;

use App\Models\Task;
use Illuminate\Support\Str;

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

    public function saveTask(Task $task)
    {
        return $task->save();
    }

    public function deleteTask(Task $task)
    {
        return $task->delete();
    }

    public function attachUserToTask(Task $task, $userId)
    {
        return $task->users()->attach($userId, ['id' => Str::uuid()]);
    }
    public function detachUserFromTask(Task $task, $userId)
    {
        return $task->users()->detach($userId);
    }

    public function checkUserOfTask(Task $task, $userId)
    {
        return $task->users()->contains($userId);
    }

    public function deleteUserOfATask(Task $task, $userId)
    {
        return $task->users()->detach($userId);
    }

    public function createTaskWithRelations(array $taskData, $userId)
    {

        $task = $this->taskModel->create($taskData);

        $task->users()->attach($userId, ['id' => Str::uuid()]);

        // Create priorities for the task
        $prioritiesData = [
            ['name' => 'Highest', 'color' => '#f12323b3', 'task_id' => $task->id],
            ['name' => 'Medium', 'color' => '#68c757c7', 'task_id' => $task->id],
            ['name' => 'Low', 'color' => '#0079BF', 'task_id' => $task->id],
        ];

        $task->priorities()->createMany($prioritiesData);

        $labelsData = [
            ['color' => '#216E4E', 'name' => '', 'task_id' => $task->id],
            ['color' => '#7F5F01', 'name' => '', 'task_id' => $task->id],
            ['color' => '#A54800', 'name' => '', 'task_id' => $task->id],
        ];

        $task->labels()->createMany($labelsData);
        return $task;
    }
}
