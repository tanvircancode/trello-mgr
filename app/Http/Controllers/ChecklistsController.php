<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChecklistRequest;
use App\Http\Requests\UpdateChecklistRequest;
use App\Models\Checklist;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class ChecklistsController extends Controller
{
    //
    public function store(StoreChecklistRequest $request)
    {
        $user_id = $request->input('user_id');
        

        if ($user_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }
        
        $checklist = Checklist::createChecklist($request->all());

        if (!$checklist) {
            return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        }

        $tasks = Task::with('checklists','checklists.checklistitems')->find($checklist->task_id);
        $projects = Project::with('members','tasks', 'tasks.users','tasks.labels', 'tasks.priorities', 'tasks.checklists','tasks.checklists.checklistitems')
        ->find($tasks->project_id);

        $response = [
            'status' => true,
            'task' => $tasks,
            'project' => $projects,
            'message' => "Priority Created Successfully"
        ];


        return response()->json($response, 200);
    }
    public function update(UpdateChecklistRequest $request) 
    {
        $user_id = $request->input('user_id');
        $id = $request->input('id');
        $task_id = $request->input('task_id');
        $name = $request->input('name');

        if ($user_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $checklistModel = new Checklist();
        $checklist = $checklistModel->updateChecklist($request->all());

        if (!$checklist) {
            return response()->json(['status' => false, 'message' => 'Checklist not found'], 404);
        }


        $task = Task::with('checklists','checklists.checklistitems')->find($checklist->task_id);
        $project = Project::with('members','tasks', 'tasks.users','tasks.labels', 'tasks.priorities', 'tasks.checklists','tasks.checklists.checklistitems')
        ->find($task->project_id);

        $response = [
            'status' => true,
            'task' => $task,
            'project' => $project,
            'message' => "Checklist Updated Successfully"
        ];


        return response()->json($response, 200);
    }

    public function destroy($id)
    {
        $checklist = Checklist::find($id);

        if (!$checklist) {
            return response()->json(['status' => false, 'message' => 'Checklist not found'], 404);
        }

        $checklist->delete();
        $task = Task::with('checklists','checklists.checklistitems')->find($checklist->task_id);
        $project = Project::with('members','tasks', 'tasks.users','tasks.labels', 'tasks.priorities', 'tasks.checklists','tasks.checklists.checklistitems')
        ->find($task->project_id);

        $response = [
            'status' => true,
            'task' => $task,
            'project' => $project,
            'message' => "Label Deleted Successfully"
        ];


        return response()->json($response, 200);
    }
}
