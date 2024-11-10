<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChecklistItemRequest;
use App\Http\Requests\UpdateChecklistItemRequest;
use App\Services\DependencyManagerService;

class ChecklistItemsController extends Controller
{
    protected ?DependencyManagerService $dependencyManagerService = null;

    public function __construct(DependencyManagerService $dependencyManagerService)
    {
        $this->dependencyManagerService = $dependencyManagerService;
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
        if (!$this->dependencyManagerService->authService->isAuthenticated($userId)) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $taskId = $request->input('task_id');
        $taskExists = $this->dependencyManagerService->taskService->findTaskById($taskId);

        if (!$taskExists) {
            return $this->dependencyManagerService->responseService->messageResponse('Task not found', false, 404);
        }

        $checklistId = $request->input('checklist_id');
        $checklistExists = $this->dependencyManagerService->checklistService->findChecklistById($checklistId);

        if (!$checklistExists) {
            return $this->dependencyManagerService->responseService->messageResponse('Checklist not found', false, 404);
        }

        $checklistItem = $this->dependencyManagerService->checklistItemService->createChecklistItem($request->all());

        $taskWithChecklists = $this->dependencyManagerService->checklistService->fetchChecklistsOfATask($taskId);
        $project = $this->dependencyManagerService->projectService->fetchDetailstWithProjectId($taskWithChecklists->project_id);
        return $this->dependencyManagerService->responseService->successProjectTaskResponse('Checklist Item Created Successfully', $project, $taskWithChecklists, true, 200);
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
        if (!$this->dependencyManagerService->authService->isAuthenticated($userId)) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $checklistId = $request->input('checklist_id');

        $checklist = $this->dependencyManagerService->checklistService->findChecklistById($checklistId);
        if (!$checklist) {
            return $this->dependencyManagerService->responseService->messageResponse('Checklist not found', false, 404);
        }

        $checklistItemId = $request->input('id');

        $checklistItem = $this->dependencyManagerService->checklistItemService->findChecklistItemById($checklistItemId);
        if (!$checklistItem) {
            return $this->dependencyManagerService->responseService->messageResponse('Checklist Item not found', false, 404);
        }

        $this->dependencyManagerService->checklistItemService->updateChecklistItemWithData($checklistItem, $request->all());

        $taskWithChecklists = $this->dependencyManagerService->checklistService->fetchChecklistsOfATask($checklist->task_id);
        $project = $this->dependencyManagerService->projectService->fetchDetailstWithProjectId($taskWithChecklists->project_id);
        return $this->dependencyManagerService->responseService->successProjectTaskResponse('Checklist item Updated Successfully', $project, $taskWithChecklists, true, 200);
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

        $checklistItem = $this->dependencyManagerService->checklistItemService->findChecklistItemById($id);
        if (!$checklistItem) {
            return $this->dependencyManagerService->responseService->messageResponse('Checklist Item not found', false, 404);
        }

        $this->dependencyManagerService->checklistItemService->deleteChecklistItem($checklistItem);

        //check later
        $taskId = $checklistItem->checklist->task->id;

        $taskWithChecklists = $this->dependencyManagerService->checklistService->fetchChecklistsOfATask($taskId);
        $project = $this->dependencyManagerService->projectService->fetchDetailstWithProjectId($taskWithChecklists->project_id);
        return $this->dependencyManagerService->responseService->successProjectTaskResponse('Checklist item deleted successfully', $project, $taskWithChecklists, true, 200);
    }
}
