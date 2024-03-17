<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChecklistItemRequest;
use App\Http\Requests\UpdateChecklistItemRequest;
use App\Models\ChecklistItem;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class ChecklistItemsController extends Controller
{
    //
    public function store(StoreChecklistItemRequest $request)
    {
        $user_id = $request->input('user_id');
        $task_id = $request->input('task_id');


        if ($user_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $task = Task::find($task_id);
        
        if (!$task) {
            return response()->json(['status' => false, 'message' => 'Task not found'], 404);
       }

        
        $item = ChecklistItem::createItem($request->all());

        if (!$item) {
            return response()->json(['status' => false, 'message' => 'Checklist not found'], 404);
        }

        $tasks = Task::with('checklists', 'checklists.checklistitems')->find($task_id);
        $projects = Project::with('tasks', 'tasks.labels', 'tasks.priorities', 'tasks.checklists','tasks.checklists.checklistitems')
        ->find($tasks->project_id);

        $response = [
            'status' => true,
            'task' => $tasks,
            'project' => $projects,
            'message' => "Priority Created Successfully"
        ];


        return response()->json($response, 200);
    }
    public function update(UpdateChecklistItemRequest $request, $id){

    }
}
