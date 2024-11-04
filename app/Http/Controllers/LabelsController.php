<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLabelRequest;
use App\Http\Requests\UpdateLabelRequest;
use App\Models\Label;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use App\Services\DependencyManagerService;
use Illuminate\Support\Facades\Auth;

class LabelsController extends Controller
{
    protected ?DependencyManagerService $dependencyManagerService = null;

    public function __construct(DependencyManagerService $dependencyManagerService)
    {
        $this->dependencyManagerService = $dependencyManagerService;
    }

    public function store(StoreLabelRequest $request)
    {
        // $userId = $request->input('user_id');
        // $projectId = $request->input('project_id');

        // if ($userId !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        // $label = Label::createLabel($request->all());

        // if (!$label) { 
        //     return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        // }             

        // $tasks = Task::with('labels')->find($label->task_id);
        // $projects = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        //     ->find($project_id);

        // $response = [
        //     'status' => true,
        //     'task' => $tasks,
        //     'project' => $projects,
        //     'message' => "Label Created Successfully"
        // ];

        // return response()->json($response, 200);

        // new service code below
        //
        $userId = $request->input('user_id');
        if (!$this->dependencyManagerService->authService->isAuthenticated($userId)) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $taskId = $request->input('task_id');
        $taskExists = $this->dependencyManagerService->taskService->findTaskById($taskId);

        if (!$taskExists) {
            return $this->dependencyManagerService->responseService->messageResponse('Task not found', false, 404);
        }

        $projectId = $request->input('project_id');

        $label = $this->dependencyManagerService->labelService->createLabel($request->all());

        $taskWithLabels = $this->dependencyManagerService->labelService->fetchLabelsOfATask($label->task_id);
        $project = $this->dependencyManagerService->projectService->fetchDetailstWithProjectId($projectId);
        return $this->dependencyManagerService->responseService->successProjectTaskResponse('Label Created Successfully', $project, $taskWithLabels, true, 200);
    }

    public function update(UpdateLabelRequest $request, $id)
    {
        // $user_id = $request->input('user_id');
        // $task_id = $request->input('task_id');

        // $task = Task::find($task_id);

        // if (!$task) {
        //     return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        // }

        // if ($user_id !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        // $label = Label::updateLabel($request->all(), $id);
        // if (!$label) {
        //     return response()->json(['status' => false, 'message' => 'Label not found'], 404);
        // }

        // $task = Task::with('labels')->find($label->task_id);
        // $project = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        //     ->find($task->project_id);

        // $response = [
        //     'status' => true,
        //     'task' => $task,
        //     'project' => $project,
        //     'message' => "Label Updated Successfully"
        // ];

        // return response()->json($response, 200);

        // new service code below

        $userId = $request->input('user_id');
        if (!$this->dependencyManagerService->authService->isAuthenticated($userId)) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $taskId = $request->input('task_id');
        $taskExists = $this->dependencyManagerService->taskService->findTaskById($taskId);

        if (!$taskExists) {
            return $this->dependencyManagerService->responseService->messageResponse('Task not found', false, 404);
        }

        $label = $this->dependencyManagerService->labelService->findLabelById($id);
        if (!$label) {
            return $this->dependencyManagerService->responseService->messageResponse('Label not found', false, 404);
        }

        $isLabelActive = $request->input('is_active');
        if (isset($isLabelActive)) {
            $label->is_active = $isLabelActive;
        }

        $this->dependencyManagerService->labelService->updateLabel($label, $request->all());
        
        $taskWithLabels = $this->dependencyManagerService->labelService->fetchLabelsOfATask($label->task_id);
        $project = $this->dependencyManagerService->projectService->fetchDetailstWithProjectId($taskWithLabels->project_id);
        return $this->dependencyManagerService->responseService->successProjectTaskResponse('Label Updated Successfully', $project, $taskWithLabels, true, 200);
    }

    public function destroy($id)
    {

        $label = Label::find($id);

        if (!$label) {
            return response()->json(['status' => false, 'message' => 'Label not found'], 404);
        }

        $label->delete();
        $task = Task::with('labels')->find($label->task_id);
        $project = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
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
        $project = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
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
