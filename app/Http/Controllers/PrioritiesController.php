<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePriorityRequest;
use App\Http\Requests\UpdatePriorityRequest;
use App\Models\Priority;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use App\Services\DependencyManagerService;
use Illuminate\Support\Facades\Auth;

class PrioritiesController extends Controller
{
    protected ?DependencyManagerService $dependencyManagerService = null;

    public function __construct(DependencyManagerService $dependencyManagerService)
    {
        $this->dependencyManagerService = $dependencyManagerService;
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
        if (!$this->dependencyManagerService->authService->isAuthenticated($userId)) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $taskId = $request->input('task_id');
        $taskExists = $this->dependencyManagerService->taskService->findTaskById($taskId);

        if (!$taskExists) {
            return $this->dependencyManagerService->responseService->messageResponse('Task not found', false, 404);
        }

        $priority = $this->dependencyManagerService->priorityService->createPriority($request->all());

        $projectId = $request->input('project_id');

        $taskWithPriorities = $this->dependencyManagerService->labelService->fetchLabelsOfATask($priority->task_id);
        $project = $this->dependencyManagerService->projectService->fetchDetailstWithProjectId($projectId);
        return $this->dependencyManagerService->responseService->successProjectTaskResponse('Priority Created Successfully', $project, $taskWithPriorities, true, 200);
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
        if (!$this->dependencyManagerService->authService->isAuthenticated($userId)) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $priorityId = $request->input('id');
        $priority = $this->dependencyManagerService->priorityService->findPriorityById($priorityId);
        if (!$priority) {
            return $this->dependencyManagerService->responseService->messageResponse('Priority not found', false, 404);
        }

        $taskExists = $this->dependencyManagerService->taskService->findTaskById($priority->task_id);

        if (!$taskExists) {
            return $this->dependencyManagerService->responseService->messageResponse('Task not found', false, 404);
        }

        $labelName = $request->input('name');
        if (isset($labelName)) {
            $priority->name = $labelName;
        }

        $labelColor = $request->input('color');
        if (isset($labelColor)) {
            $priority->color = $labelColor;
        }

        $this->dependencyManagerService->priorityService->updatePriority($priority, $request->all());

        $taskWithPriorities = $this->dependencyManagerService->priorityService->fetchPrioritiesOfATask($priority->task_id);
        $project = $this->dependencyManagerService->projectService->fetchDetailstWithProjectId($taskWithPriorities->project_id);
        return $this->dependencyManagerService->responseService->successProjectTaskResponse('Priority Updated Successfully', $project, $taskWithPriorities, true, 200);
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

        $priority = $this->dependencyManagerService->priorityService->findPriorityById($priorityId);
        if (!$priority) {
            return $this->dependencyManagerService->responseService->messageResponse('Priority not found', false, 404);
        }

        $this->dependencyManagerService->priorityService->deletePriority($priority);

        $taskWithPriorities = $this->dependencyManagerService->priorityService->fetchPrioritiesOfATask($priority->task_id);
        $project = $this->dependencyManagerService->projectService->fetchDetailstWithProjectId($taskWithPriorities->project_id);
        return $this->dependencyManagerService->responseService->successProjectTaskResponse('Priority Deleted Successfully', $project, $taskWithPriorities, true, 200);
    }

    public function updateSelected(Request $request)
    {
        // $user_id = $request->input('user_id');
        $task_id = $request->input('task_id');

        // if ($user_id !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        $priorityModel = new Priority();
        $priority = $priorityModel->changePriority($request->all());

        if (!$priority) {
            return response()->json(['status' => false, 'message' => 'Priority not found'], 404);
        }

        $task = Task::with('priorities')->find($task_id);
        $project = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
            ->find($task->project_id);

        $response = [
            'status' => true,
            'task' => $task,
            'project' => $project,
            'message' => "Priority Updated Successfully"
        ];

        return response()->json($response, 200);

        // new service code below
        $userId = $request->input('user_id');
        if (!$this->dependencyManagerService->authService->isAuthenticated($userId)) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $priorityId = $request->input('id');
        $priority = $this->dependencyManagerService->priorityService->findPriorityById($priorityId);

        if (!$priority) {
            return $this->dependencyManagerService->responseService->messageResponse('Priority not found', false, 404);
        }

        $taskId = $request->input('task_id');
        $priorities = $this->dependencyManagerService->priorityService->fetchPrioritiesOfATaskNew($taskId);

        $priorityX = $this->dependencyManagerService->priorityService->changeSelectedPriority($priorities, $priorityId, $taskId);




        $taskWithPriorities = $this->dependencyManagerService->priorityService->fetchPrioritiesOfATask($taskId);
        $priority = $this->dependencyManagerService->priorityService->findPriorityById($priorityId);
    }
}
