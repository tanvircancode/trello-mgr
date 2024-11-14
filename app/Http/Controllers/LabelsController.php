<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLabelRequest;
use App\Http\Requests\UpdateLabelRequest;
use Illuminate\Http\Request;
use App\Services\TaskService;
use App\Services\AuthService;
use App\Services\LabelService;
use App\Services\ResponseService;
use App\Services\ListService;
use App\Services\UserService;
use App\Services\ProjectService;

class LabelsController extends Controller
{
    protected $taskService;
    protected $authService;
    protected $responseService;
    protected $projectService;
    protected $labelService;

    public function __construct(TaskService $taskService, AuthService $authService, ResponseService $responseService, ProjectService $projectService, LabelService $labelService)
    {
        $this->taskService = $taskService;
        $this->authService = $authService;
        $this->labelService = $labelService;
        $this->responseService = $responseService;
        $this->projectService = $projectService;
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

        $userId = $request->input('user_id');
        if (!$this->authService->isAuthenticated($userId)) {
            return $this->responseService->unauthorizedResponse();
        }

        $taskId = $request->input('task_id');
        $taskExists = $this->taskService->findTaskById($taskId);

        if (!$taskExists) {
            return $this->responseService->messageResponse('Task not found', false, 404);
        }

        $projectId = $request->input('project_id');

        $label = $this->labelService->createLabel($request->all());

        $taskWithLabels = $this->labelService->fetchLabelsOfATask($label->task_id);
        $project = $this->projectService->fetchDetailstWithProjectId($projectId);
        return $this->responseService->successProjectTaskResponse('Label Created Successfully', $project, $taskWithLabels, true, 200);
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
        if (!$this->authService->isAuthenticated($userId)) {
            return $this->responseService->unauthorizedResponse();
        }

        $taskId = $request->input('task_id');
        $taskExists = $this->taskService->findTaskById($taskId);

        if (!$taskExists) {
            return $this->responseService->messageResponse('Task not found', false, 404);
        }

        $label = $this->labelService->findLabelById($id);
        if (!$label) {
            return $this->responseService->messageResponse('Label not found', false, 404);
        }

        $isLabelActive = $request->input('is_active');
        if (isset($isLabelActive)) {
            $label->is_active = $isLabelActive;
        }

        $this->labelService->updateLabel($label, $request->all());

        $taskWithLabels = $this->labelService->fetchLabelsOfATask($label->task_id);
        $project = $this->projectService->fetchDetailstWithProjectId($taskWithLabels->project_id);
        return $this->responseService->successProjectTaskResponse('Label Updated Successfully', $project, $taskWithLabels, true, 200);
    }

    public function destroy($id)
    {

        // $label = Label::find($id);

        // if (!$label) {
        //     return response()->json(['status' => false, 'message' => 'Label not found'], 404);
        // }

        // $label->delete();
        // $task = Task::with('labels')->find($label->task_id);
        // $project = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        //     ->find($task->project_id);

        // $response = [
        //     'status' => true,
        //     'task' => $task,
        //     'project' => $project,
        //     'message' => "Label Deleted Successfully"
        // ];

        // return response()->json($response, 200);

        // new service code below
        $label = $this->labelService->findLabelById($id);
        if (!$label) {
            return $this->responseService->messageResponse('Label not found', false, 404);
        }

        $this->labelService->deleteLabel($label);

        $taskWithLabels = $this->labelService->fetchLabelsOfATask($label->task_id);
        $project = $this->projectService->fetchDetailstWithProjectId($taskWithLabels->project_id);
        return $this->responseService->successProjectTaskResponse('Label deleted Successfully', $project, $taskWithLabels, true, 200);
    }

    public function updateSelected(Request $request, $id)
    {

        // $userId = $request->input('user_id');
        // $taskId = $request->input('task_id');

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
        if (!$this->authService->isAuthenticated($userId)) {
            return $this->responseService->unauthorizedResponse();
        }

        $taskId = $request->input('task_id');
        $taskExists = $this->taskService->findTaskById($taskId);

        if (!$taskExists) {
            return $this->responseService->messageResponse('Task not found', false, 404);
        }

        $label = $this->labelService->findLabelById($id);
        if (!$label) {
            return $this->responseService->messageResponse('Label not found', false, 404);
        }

        $isLabelActive = $request->input('is_active');
        if (isset($isLabelActive)) {
            $label->is_active = $isLabelActive;
        }

        $this->labelService->updateLabel($label, $request->all());
        $taskWithLabels = $this->labelService->fetchLabelsOfATask($label->task_id);
        $project = $this->projectService->fetchDetailstWithProjectId($taskWithLabels->project_id);
        return $this->responseService->successProjectTaskResponse('Label Updated Successfully', $project, $taskWithLabels, true, 200);
    }
}
