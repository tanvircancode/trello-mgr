<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChecklistRequest;
use App\Http\Requests\UpdateChecklistRequest;
use App\Services\TaskService;
use App\Services\AuthService;
use App\Services\ResponseService;
use App\Services\ProjectService;
use App\Services\ChecklistService;

class ChecklistsController extends Controller
{
    protected $taskService;
    protected $authService;
    protected $responseService;
    protected $projectService;
    protected $checklistService;

    public function __construct(TaskService $taskService,  ChecklistService $checklistService, AuthService $authService, ResponseService $responseService, ProjectService $projectService)
    {
        $this->taskService = $taskService;
        $this->authService = $authService;
        $this->responseService = $responseService;
        $this->projectService = $projectService;
        $this->checklistService = $checklistService;
    }

    public function store(StoreChecklistRequest $request)
    {
        // $user_id = $request->input('user_id');


        // if ($user_id !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        // $checklist = Checklist::createChecklist($request->all());

        // if (!$checklist) {
        //     return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        // }

        // $tasks = Task::with('checklists', 'checklists.checklistitems')->find($checklist->task_id);
        // $projects = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        //     ->find($tasks->project_id);

        // $response = [
        //     'status' => true,
        //     'task' => $tasks,
        //     'project' => $projects,
        //     'message' => "Checklist Created Successfully"
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

        $checklist = $this->checklistService->createChecklist($request->all());

        $taskWithChecklists = $this->checklistService->fetchChecklistsOfATask($taskId);
        $project = $this->projectService->fetchDetailstWithProjectId($taskWithChecklists->project_id);
        return $this->responseService->successProjectTaskResponse('Checklist Created Successfully', $project, $taskWithChecklists, true, 200);
    }
    public function update(UpdateChecklistRequest $request)
    {
        // $user_id = $request->input('user_id');
        // $id = $request->input('id');
        // $task_id = $request->input('task_id');
        // $name = $request->input('name');

        // if ($user_id !== Auth::user()->id) { 
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        // $checklistModel = new Checklist();
        // $checklist = $checklistModel->updateChecklist($request->all());

        // if (!$checklist) {
        //     return response()->json(['status' => false, 'message' => 'Checklist not found'], 404);
        // }

        // $task = Task::with('checklists', 'checklists.checklistitems')->find($checklist->task_id);
        // $project = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        //     ->find($task->project_id);

        // $response = [
        //     'status' => true,
        //     'task' => $task,
        //     'project' => $project,
        //     'message' => "Checklist Updated Successfully"
        // ];

        // return response()->json($response, 200);

        // service layer code starts here

        $userId = $request->input('user_id');
        if (!$this->authService->isAuthenticated($userId)) {
            return $this->responseService->unauthorizedResponse();
        }

        $checklistId = $request->input('id');
        $checklist = $this->checklistService->findChecklistById($checklistId);
        if (!$checklist) {
            return $this->responseService->messageResponse('Checklist not found', false, 404);
        }

        $checklistName = $request->input('name');
        if (isset($checklistName)) {
            $checklist->name = $checklistName;
        }

        $this->checklistService->updateChecklist($checklist);

        $taskId = $request->input('task_id');
        $taskWithChecklist = $this->checklistService->fetchChecklistsOfATask($taskId);
        $project = $this->projectService->fetchDetailstWithProjectId($taskWithChecklist->project_id);
        return $this->responseService->successProjectTaskResponse('Checklist Updated Successfully', $project, $taskWithChecklist, true, 200);
    }

    public function destroy($id)
    {
        // $checklist = Checklist::find($id);

        // if (!$checklist) {
        //     return response()->json(['status' => false, 'message' => 'Checklist not found'], 404);
        // }

        // $checklist->delete();
        // $task = Task::with('checklists', 'checklists.checklistitems')->find($checklist->task_id);
        // $project = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        //     ->find($task->project_id);

        // $response = [
        //     'status' => true,
        //     'task' => $task,
        //     'project' => $project,
        //     'message' => "Checklist Deleted Successfully"
        // ];


        // return response()->json($response, 200);

        // service layer code starts here

        $checklist = $this->checklistService->findChecklistById($id);

        if (!$checklist) {
            return $this->responseService->messageResponse('Checklist not found', false, 404);
        }
        $taskId = $checklist->task_id;

        $this->checklistService->deleteChecklist($checklist);

        $taskWithChecklist = $this->checklistService->fetchChecklistsOfATask($taskId);
        $project = $this->projectService->fetchDetailstWithProjectId($taskWithChecklist->project_id);
        return $this->responseService->successProjectTaskResponse('Checklist Deleted Successfully', $project, $taskWithChecklist, true, 200);
    }
}
