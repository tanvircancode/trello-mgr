<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePriorityRequest;
use App\Http\Requests\UpdatePriorityRequest;
use Illuminate\Http\Request;
use App\Services\TaskService;
use App\Services\AuthService;
use App\Services\ResponseService;
use App\Services\LabelService;
use App\Services\ProjectService;
use App\Services\PriorityService;

class PrioritiesController extends Controller
{
    protected $taskService;
    protected $authService;
    protected $responseService;
    protected $labelService;
    protected $projectService;
    protected $priorityService;


    public function __construct(TaskService $taskService, AuthService $authService, ResponseService $responseService, ProjectService $projectService, LabelService $labelService, PriorityService $priorityService)
    {
        $this->taskService = $taskService;
        $this->authService = $authService;
        $this->responseService = $responseService;
        $this->projectService = $projectService;
        $this->priorityService = $priorityService;
        $this->labelService = $labelService;
    }

    public function store(StorePriorityRequest $request)
    {
        // $user_id = $request->input('user_id');
        // $project_id = $request->input('project_id');

        // if ($user_id !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        // $priority = Priority::createPriority($request->all());

        // if (!$priority) {
        //     return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        // }

        // $tasks = Task::with('priorities')->find($priority->task_id);
        // $projects = Project::with('members','tasks', 'tasks.users','tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        //     ->find($project_id);

        // $response = [
        //     'status' => true,
        //     'task' => $tasks,
        //     'project' => $projects,
        //     'message' => "Priority Created Successfully"
        // ];


        // return response()->json($response, 200);

        // service layer code starts here

        $userId = $request->input('user_id');
        if (!$this->authService->isAuthenticated($userId)) {
            return $this->responseService->unauthorizedResponse();
        }

        $taskId = $request->input('task_id');
        $taskExists = $this->taskService->findTaskById($taskId);

        if (!$taskExists) {
            return $this->responseService->messageResponse('Task not found', false, 404);
        }

        $priority = $this->priorityService->createPriority($request->all());

        $projectId = $request->input('project_id');

        $taskWithPriorities = $this->labelService->fetchLabelsOfATask($priority->task_id);
        $project = $this->projectService->fetchDetailstWithProjectId($projectId);
        return $this->responseService->successProjectTaskResponse('Priority Created Successfully', $project, $taskWithPriorities, true, 200);
    }

    public function update(UpdatePriorityRequest $request)
    {
        // $user_id = $request->input('user_id');

        // if ($user_id !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        // $priorityModel = new Priority();
        // $priority = $priorityModel->updatePriority($request->all());

        // if (!$priority) {
        //     return response()->json(['status' => false, 'message' => 'Priority not found'], 404);
        // }

        // $task = Task::with('priorities')->find($priority->task_id);
        // $project = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        //     ->find($task->project_id);

        // $response = [
        //     'status' => true,
        //     'task' => $task,
        //     'project' => $project,
        //     'message' => "Priority Updated Successfully"
        // ];

        // return response()->json($response, 200);

        // service layer code starts here

        $userId = $request->input('user_id');
        if (!$this->authService->isAuthenticated($userId)) {
            return $this->responseService->unauthorizedResponse();
        }

        $priorityId = $request->input('id');
        $priority = $this->priorityService->findPriorityById($priorityId);
        if (!$priority) {
            return $this->responseService->messageResponse('Priority not found', false, 404);
        }

        $taskExists = $this->taskService->findTaskById($priority->task_id);

        if (!$taskExists) {
            return $this->responseService->messageResponse('Task not found', false, 404);
        }

        $labelName = $request->input('name');
        if (isset($labelName)) {
            $priority->name = $labelName;
        }

        $labelColor = $request->input('color');
        if (isset($labelColor)) {
            $priority->color = $labelColor;
        }

        $this->priorityService->updatePriority($priority, $request->all());

        $taskWithPriorities = $this->priorityService->fetchPrioritiesOfATask($priority->task_id);
        $project = $this->projectService->fetchDetailstWithProjectId($taskWithPriorities->project_id);
        return $this->responseService->successProjectTaskResponse('Priority Updated Successfully', $project, $taskWithPriorities, true, 200);
    }

    public function destroy($priorityId)
    {
        // $priority = Priority::find($id);

        // if (!$priority) {
        //     return response()->json(['status' => false, 'message' => 'Priority not found'], 404);
        // }

        // $priority->delete();

        // $task = Task::with('priorities')->find($priority->task_id);
        // $project = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        //     ->find($task->project_id);

        // $response = [
        //     'status' => true,
        //     'task' => $task,
        //     'project' => $project,
        //     'message' => "Priority Deleted Successfully"
        // ];


        // return response()->json($response, 200);

        // service layer code starts here

        $priority = $this->priorityService->findPriorityById($priorityId);
        if (!$priority) {
            return $this->responseService->messageResponse('Priority not found', false, 404);
        }

        $this->priorityService->deletePriority($priority);

        $taskWithPriorities = $this->priorityService->fetchPrioritiesOfATask($priority->task_id);
        $project = $this->projectService->fetchDetailstWithProjectId($taskWithPriorities->project_id);
        return $this->responseService->successProjectTaskResponse('Priority Deleted Successfully', $project, $taskWithPriorities, true, 200);
    }

    public function updateSelected(Request $request)
    {
        // $user_id = $request->input('user_id');
        // $task_id = $request->input('task_id');

        // if ($user_id !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        // $priorityModel = new Priority();
        // $priority = $priorityModel->changePriority($request->all());

        // if (!$priority) {
        //     return response()->json(['status' => false, 'message' => 'Priority not found'], 404);
        // }

        // $task = Task::with('priorities')->find($task_id);
        // $project = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        //     ->find($task->project_id);

        // $response = [
        //     'status' => true,
        //     'task' => $task,
        //     'project' => $project,
        //     'message' => "Priority Updated Successfully"
        // ];

        // return response()->json($response, 200);

        // new service code below
        $userId = $request->input('user_id');
        if (!$this->authService->isAuthenticated($userId)) {
            return $this->responseService->unauthorizedResponse();
        }

        $priorityId = $request->input('id');
        $taskId = $request->input('task_id');

        $priority = $this->priorityService->findPriorityById($priorityId);

        $priorities = $this->priorityService->fetchPrioritiesOfATaskNew($taskId);
        $previousSelectedPriority = $this->priorityService->selectPreviousPriority($priorities);

        if ($priorityId === 'null') {
            return $this->priorityService->deactivatePriority($priorities);
        } else if (!$priority) {
            return $this->responseService->messageResponse('Priority not found', false, 404);
        } else if ($previousSelectedPriority !== null  && $previousSelectedPriority->id === $priorityId) {
            $this->priorityService->unselectSelectedPriority($priority);
        } else {
            $this->priorityService->selectNewPriority($priorities, $priorityId);
        }

        $taskWithPriorities = $this->priorityService->fetchPrioritiesOfATask($taskId);
        $project = $this->projectService->fetchDetailstWithProjectId($taskWithPriorities->project_id);
        return $this->responseService->successProjectTaskResponse('Priority Updated Successfully', $project, $taskWithPriorities, true, 200);
    }
}
