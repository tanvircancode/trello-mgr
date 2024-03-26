<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLabelRequest;
use App\Http\Requests\UpdateLabelRequest;
use App\Models\Label;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class LabelsController extends Controller
{
    public function store(StoreLabelRequest $request)
    {
        $user_id = $request->input('user_id');
        $project_id = $request->input('project_id');

        if ($user_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }
        
        $label = Label::createLabel($request->all());

        if (!$label) {
            return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        }

        $tasks = Task::with('labels')->find($label->task_id);
        $projects = Project::with('members','tasks', 'tasks.users','tasks.labels', 'tasks.priorities', 'tasks.checklists','tasks.checklists.checklistitems')
        ->find($project_id);

        $response = [
            'status' => true,
            'task' => $tasks,
            'project' => $projects,
            'message' => "Label Created Successfully"
        ];


        return response()->json($response, 200);
    }

    public function update(UpdateLabelRequest $request, $id)
    {
        $user_id = $request->input('user_id');
        $task_id = $request->input('task_id');

        $task = Task::find($task_id);

        if (!$task) {
            return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        }

        if ($user_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $label = Label::updateLabel($request->all(), $id);
        if (!$label) {
            return response()->json(['status' => false, 'message' => 'Label not found'], 404);
        }
        
        $task = Task::with('labels')->find($label->task_id);
        $project = Project::with('members','tasks', 'tasks.users','tasks.labels', 'tasks.priorities', 'tasks.checklists','tasks.checklists.checklistitems')
        ->find($task->project_id);

        $response = [
            'status' => true,
            'task' => $task,
            'project' => $project,
            'message' => "Label Updated Successfully"
        ];

        return response()->json($response, 200);
    }

    public function destroy($id)
    {

        $label = Label::find($id);

        if (!$label) {
            return response()->json(['status' => false, 'message' => 'Label not found'], 404);
        }

        $label->delete();
        $task = Task::with('labels')->find($label->task_id);
        $project = Project::with('members','tasks', 'tasks.users','tasks.labels' , 'tasks.priorities', 'tasks.checklists','tasks.checklists.checklistitems')
        ->find($task->project_id);

        $response = [
            'status' => true,
            'task' => $task,
            'project' => $project,
            'message' => "Label Deleted Successfully"
        ];


        return response()->json($response, 200);
    }
    public function updateSelected(Request $request, $id)
    {

        $user_id = $request->input('user_id');
        $task_id = $request->input('task_id');

        $task = Task::find($task_id);

        if (!$task) {
            return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        }

        if ($user_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $label = Label::updateLabel($request->all(), $id);
        if (!$label) {
            return response()->json(['status' => false, 'message' => 'Label not found'], 404);
        }
        
        $task = Task::with('labels')->find($label->task_id);
        $project = Project::with('members','tasks', 'tasks.users','tasks.labels', 'tasks.priorities', 'tasks.checklists','tasks.checklists.checklistitems')
        ->find($task->project_id);

        $response = [
            'status' => true,
            'task' => $task,
            'project' => $project,
            'message' => "Label Updated Successfully"
        ];


        return response()->json($response, 200);
    }
}
