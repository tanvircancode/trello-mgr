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
        $projects = Project::with('tasks', 'tasks.labels', 'tasks.priorities', 'tasks.checklists')->find($project_id);

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
        $label = Label::find($id);

        if (!$label) {
            return response()->json(['status' => false, 'message' => 'Label not found'], 404);
        }

        if ($user_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        if ($request->has('is_active')) {
            $label->is_active = $request->is_active;
        }

        if ($request->has('name')) {
            $label->name = $request->name ?? "";
        }

        if ($request->has('color')) {
            $label->color = $request->color;
        }

        $label->save();
        $task = Task::with('labels')->find($label->task_id);
        $project = Project::with('tasks', 'tasks.labels', 'tasks.priorities', 'tasks.checklists')->find($task->project_id);

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
        $project = Project::with('tasks', 'tasks.labels' , 'tasks.priorities', 'tasks.checklists')->find($task->project_id);

        $response = [
            'status' => true,
            'task' => $task,
            'project' => $project,
            'message' => "Label Deleted Successfully"
        ];


        return response()->json($response, 200);
    }
}
