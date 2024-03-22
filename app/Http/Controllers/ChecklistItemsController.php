<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChecklistItemRequest;
use App\Http\Requests\UpdateChecklistItemRequest;
use App\Models\Checklist;
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
        $projects = Project::with('members','tasks','tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists','tasks.checklists.checklistitems')
        ->find($tasks->project_id);

        $response = [
            'status' => true,
            'task' => $tasks,
            'project' => $projects,
            'message' => "Checklist item Created Successfully"
        ];


        return response()->json($response, 200);
    }
    public function update(UpdateChecklistItemRequest $request){
        $user_id = $request->input('user_id');
       
        $checklist_id = $request->input('checklist_id');
        

        if ($user_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $checklist = Checklist::find($checklist_id);
       
        
        if (!$checklist) {
            return response()->json(['status' => false, 'message' => 'Checklist not found'], 404);
       }

        $itemModel = new ChecklistItem();
        $item = $itemModel->updateItem($request->all());

        if (!$item) {
            return response()->json(['status' => false, 'message' => 'Checklist item not found'], 404);
        }

        $task = Task::with('checklists','checklists.checklistitems')->find($checklist->task_id);
        $project = Project::with('members','tasks', 'tasks.users','tasks.labels', 'tasks.priorities', 'tasks.checklists','tasks.checklists.checklistitems')
        ->find($task->project_id);

        $response = [
            'status' => true,
            'task' => $task,
            'project' => $project,
            'message' => "Checklist item Updated Successfully"
        ];


        return response()->json($response, 200);
    }

    public function destroy($id)
    {
        $item = ChecklistItem::find($id);

        if (!$item) {
            return response()->json(['status' => false, 'message' => 'Checklist Item not found'], 404);
        }

        $item->delete();

        $taskId = $item->checklist->task->id;

        $task = Task::with('checklists','checklists.checklistitems')->find($taskId);
        $project = Project::with('members','tasks', 'tasks.users','tasks.labels', 'tasks.priorities', 'tasks.checklists','tasks.checklists.checklistitems')
        ->find($task->project_id);

        $response = [
            'status' => true,
            'task' => $task,
            'project' => $project,
            'message' => "Checklist item Deleted Successfully"
        ];
        return response()->json($response, 200);
    }


}
