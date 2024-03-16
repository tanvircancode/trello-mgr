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

        $tasks = Task::with('checklists')->find($checklist->task_id);
        $projects = Project::with('tasks', 'tasks.labels', 'tasks.priorities', 'tasks.checklists')
        ->find($tasks->project_id);

        $response = [
            'status' => true,
            'task' => $tasks,
            'project' => $projects,
            'message' => "Priority Created Successfully"
        ];


        return response()->json($response, 200);
    }
    public function update(UpdateChecklistRequest $request, $id) 
    {

    }
}
