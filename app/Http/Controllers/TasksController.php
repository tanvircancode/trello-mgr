<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class TasksController extends Controller
{
    //
    public function store(StoreTaskRequest $request, $id)
    {
        if ($id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $task = Task::createTask($request->all());
        if (!$task) {
            return response()->json(['status' => false, 'message' => 'Project not found'], 404);
        }

        $tasks = Project::with('tasks', 'tasks.labels' , 'tasks.priorities', 'tasks.checklists')->find($task->project_id);

        $response = [
            'status' => true,
            'data' => $tasks,
            'message' => "Task Created Successfully"
        ];

        return response()->json($response, 200);
    }

    public function update(Request $request)
    {

        $user_id = $request->input('user_id');
        $id = $request->input('id');
        $project_id = $request->input('project_id');
        $description = $request->input('description');


        $task = Task::find($id);

        if (!$task) {
            return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        }

        if ($user_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }


        $task->description = $description;

        $task->save();
        
        $project = Project::with('tasks', 'tasks.labels', 'tasks.priorities', 'tasks.checklists')->find($task->project_id);

        $response = [
            'status' => true,
            'task' => $task,
            'project' => $project,
            'message' => "Desription Updated Successfully"
        ];


        return response()->json($response, 200);
    }
}
