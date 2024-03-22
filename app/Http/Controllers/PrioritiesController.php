<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePriorityRequest;
use App\Http\Requests\UpdatePriorityRequest;
use App\Models\Priority;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PrioritiesController extends Controller
{
    public function store(StorePriorityRequest $request)
    {
        $user_id = $request->input('user_id');
        $project_id = $request->input('project_id');

        if ($user_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $priority = Priority::createPriority($request->all());

        if (!$priority) {
            return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        }

        $tasks = Task::with('priorities')->find($priority->task_id);
        $projects = Project::with('members','tasks', 'tasks.users','tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
            ->find($project_id);

        $response = [
            'status' => true,
            'task' => $tasks,
            'project' => $projects,
            'message' => "Priority Created Successfully"
        ];


        return response()->json($response, 200);
    }

    public function update(UpdatePriorityRequest $request)
    {
        $user_id = $request->input('user_id');

        if ($user_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $priorityModel = new Priority();
        $priority = $priorityModel->updatePriority($request->all());

        if (!$priority) {
            return response()->json(['status' => false, 'message' => 'Priority not found'], 404);
        }

        $task = Task::with('priorities')->find($priority->task_id);
        $project = Project::with('members','tasks', 'tasks.users','tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        ->find($task->project_id);

        $response = [
            'status' => true,
            'task' => $task,
            'project' => $project,
            'message' => "Priority Updated Successfully"
        ];

        return response()->json($response, 200);
    }

    public function destroy($id)
    {
        $priority = Priority::find($id);

        if (!$priority) {
            return response()->json(['status' => false, 'message' => 'Priority not found'], 404);
        }

        $priority->delete();
        $task = Task::with('priorities')->find($priority->task_id);
        $project = Project::with('members','tasks', 'tasks.users','tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        ->find($task->project_id);

        $response = [
            'status' => true,
            'task' => $task,
            'project' => $project,
            'message' => "Priority Deleted Successfully"
        ];


        return response()->json($response, 200);
    }

    public function updateSelected(Request $request)
    {
        $user_id = $request->input('user_id');
        $task_id = $request->input('task_id');

        if ($user_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $priorityModel = new Priority();
        $priority = $priorityModel->changePriority($request->all());

        if (!$priority) {
            return response()->json(['status' => false, 'message' => 'Priority not found'], 404);
        }

        $task = Task::with('priorities')->find($task_id);
        $project = Project::with('members','tasks', 'tasks.users','tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        ->find($task->project_id);

        $response = [
            'status' => true,
            'task' => $task,
            'project' => $project,
            'message' => "Priority Updated Successfully"
        ];


        return response()->json($response, 200);
    }
}
