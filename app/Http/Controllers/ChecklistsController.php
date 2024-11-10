<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChecklistRequest;
use App\Http\Requests\UpdateChecklistRequest;
use App\Models\Checklist;
use App\Models\Project;
use App\Models\Task;
use App\Services\DependencyManagerService;
use Illuminate\Support\Facades\Auth;


class ChecklistsController extends Controller
{
    protected ?DependencyManagerService $dependencyManagerService = null;

    public function __construct(DependencyManagerService $dependencyManagerService)
    {
        $this->dependencyManagerService = $dependencyManagerService;
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
        if (!$this->dependencyManagerService->authService->isAuthenticated($userId)) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $taskId = $request->input('task_id');
        $taskExists = $this->dependencyManagerService->taskService->findTaskById($taskId);

        if (!$taskExists) {
            return $this->dependencyManagerService->responseService->messageResponse('Task not found', false, 404);
        }

        $checklist = $this->dependencyManagerService->checklistService->createChecklist($request->all());

        $taskWithChecklists = $this->dependencyManagerService->checklistService->fetchChecklistsOfATask($taskId);
        $project = $this->dependencyManagerService->projectService->fetchDetailstWithProjectId($taskWithChecklists->project_id);
        return $this->dependencyManagerService->responseService->successProjectTaskResponse('Checklist Created Successfully', $project, $taskWithChecklists, true, 200);
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
        if (!$this->dependencyManagerService->authService->isAuthenticated($userId)) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $checklistId = $request->input('id');
        $checklist = $this->dependencyManagerService->checklistService->findChecklistById($checklistId);
        if (!$checklist) {
            return $this->dependencyManagerService->responseService->messageResponse('Checklist not found', false, 404);
        }

        $checklistName = $request->input('name');
        if (isset($checklistName)) {
            $checklist->name = $checklistName;
        }

        $this->dependencyManagerService->checklistService->updateChecklist($checklist);

        $taskId = $request->input('task_id');
        $taskWithChecklist = $this->dependencyManagerService->checklistService->fetchChecklistsOfATask($taskId);
        $project = $this->dependencyManagerService->projectService->fetchDetailstWithProjectId($taskWithChecklist->project_id);
        return $this->dependencyManagerService->responseService->successProjectTaskResponse('Checklist Updated Successfully', $project, $taskWithChecklist, true, 200);
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

        $checklist = $this->dependencyManagerService->checklistService->findChecklistById($id);

        if (!$checklist) {
            return $this->dependencyManagerService->responseService->messageResponse('Checklist not found', false, 404);
        }
        $taskId = $checklist->task_id;

        $this->dependencyManagerService->checklistService->deleteChecklist($checklist);

        $taskWithChecklist = $this->dependencyManagerService->checklistService->fetchChecklistsOfATask($taskId);
        $project = $this->dependencyManagerService->projectService->fetchDetailstWithProjectId($taskWithChecklist->project_id);
        return $this->dependencyManagerService->responseService->successProjectTaskResponse('Checklist Deleted Successfully', $project, $taskWithChecklist, true, 200);
    }
}
