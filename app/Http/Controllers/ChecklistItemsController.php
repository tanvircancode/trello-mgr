<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChecklistItemRequest;
use App\Http\Requests\UpdateChecklistItemRequest;
use App\Services\TaskService;
use App\Services\AuthService;
use App\Services\ResponseService;
use App\Services\ProjectService;
use App\Services\ChecklistService;
use App\Services\ChecklistItemService;

class ChecklistItemsController extends Controller
{
    protected $taskService;
    protected $authService;
    protected $responseService;
    protected $projectService;
    protected $checklistService;
    protected $checklistItemService;


    public function __construct(TaskService $taskService, ChecklistItemService $checklistItemService, ChecklistService $checklistService, AuthService $authService, ResponseService $responseService, ProjectService $projectService)
    {
        $this->taskService = $taskService;
        $this->authService = $authService;
        $this->responseService = $responseService;
        $this->projectService = $projectService;
        $this->checklistService = $checklistService;
        $this->checklistItemService = $checklistItemService;
    }

    public function store(StoreChecklistItemRequest $request)
    {
        // $user_id = $request->input('user_id');
        // $task_id = $request->input('task_id');


        // if ($user_id !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        // $task = Task::find($task_id);

        // if (!$task) {
        //     return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        // }

        // $item = ChecklistItem::createItem($request->all());

        // if (!$item) {
        //     return response()->json(['status' => false, 'message' => 'Checklist not found'], 404);
        // }

        // $tasks = Task::with('checklists', 'checklists.checklistitems')->find($task_id);
        // $projects = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        //     ->find($tasks->project_id);

        // $response = [
        //     'status' => true,
        //     'task' => $tasks,
        //     'project' => $projects,
        //     'message' => "Checklist item Created Successfully"
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

        $checklistId = $request->input('checklist_id');
        $checklistExists = $this->checklistService->findChecklistById($checklistId);

        if (!$checklistExists) {
            return $this->responseService->messageResponse('Checklist not found', false, 404);
        }

        $checklistItem = $this->checklistItemService->createChecklistItem($request->all());

        $taskWithChecklists = $this->checklistService->fetchChecklistsOfATask($taskId);
        $project = $this->projectService->fetchDetailstWithProjectId($taskWithChecklists->project_id);
        return $this->responseService->successProjectTaskResponse('Checklist Item Created Successfully', $project, $taskWithChecklists, true, 200);
    }

    public function update(UpdateChecklistItemRequest $request)
    {
        // $user_id = $request->input('user_id');

        // $checklist_id = $request->input('checklist_id');

        // if ($user_id !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        // $checklist = Checklist::find($checklist_id);


        // if (!$checklist) {
        //     return response()->json(['status' => false, 'message' => 'Checklist not found'], 404);
        // }

        // $itemModel = new ChecklistItem();
        // $item = $itemModel->updateItem($request->all());

        // if (!$item) {
        //     return response()->json(['status' => false, 'message' => 'Checklist item not found'], 404);
        // }

        // $task = Task::with('checklists', 'checklists.checklistitems')->find($checklist->task_id);
        // $project = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        //     ->find($task->project_id);

        // $response = [
        //     'status' => true,
        //     'task' => $task,
        //     'project' => $project,
        //     'message' => "Checklist item Updated Successfully"
        // ];

        // return response()->json($response, 200);

        // service layer code starts here

        $userId = $request->input('user_id');
        if (!$this->authService->isAuthenticated($userId)) {
            return $this->responseService->unauthorizedResponse();
        }

        $checklistId = $request->input('checklist_id');

        $checklist = $this->checklistService->findChecklistById($checklistId);
        if (!$checklist) {
            return $this->responseService->messageResponse('Checklist not found', false, 404);
        }

        $checklistItemId = $request->input('id');

        $checklistItem = $this->checklistItemService->findChecklistItemById($checklistItemId);
        if (!$checklistItem) {
            return $this->responseService->messageResponse('Checklist Item not found', false, 404);
        }

        $this->checklistItemService->updateChecklistItemWithData($checklistItem, $request->all());

        $taskWithChecklists = $this->checklistService->fetchChecklistsOfATask($checklist->task_id);
        $project = $this->projectService->fetchDetailstWithProjectId($taskWithChecklists->project_id);
        return $this->responseService->successProjectTaskResponse('Checklist item Updated Successfully', $project, $taskWithChecklists, true, 200);
    }

    public function destroy($id)
    {
        // $item = ChecklistItem::find($id);

        // if (!$item) {
        //     return response()->json(['status' => false, 'message' => 'Checklist Item not found'], 404);
        // }

        // $item->delete();

        // $taskId = $item->checklist->task->id;

        // $task = Task::with('checklists', 'checklists.checklistitems')->find($taskId);
        // $project = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        //     ->find($task->project_id);

        // $response = [
        //     'status' => true,
        //     'task' => $task,
        //     'project' => $project,
        //     'message' => "Checklist item Deleted Successfully"
        // ];
        // return response()->json($response, 200);

        // service layer code starts here

        $checklistItem = $this->checklistItemService->findChecklistItemById($id);
        if (!$checklistItem) {
            return $this->responseService->messageResponse('Checklist Item not found', false, 404);
        }

        $this->checklistItemService->deleteChecklistItem($checklistItem);

        //check later
        $taskId = $checklistItem->checklist->task->id;

        $taskWithChecklists = $this->checklistService->fetchChecklistsOfATask($taskId);
        $project = $this->projectService->fetchDetailstWithProjectId($taskWithChecklists->project_id);
        return $this->responseService->successProjectTaskResponse('Checklist item deleted successfully', $project, $taskWithChecklists, true, 200);
    }
}
