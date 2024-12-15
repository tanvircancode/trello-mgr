<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\ReorderTasksRequest;
use Illuminate\Http\Request;
use App\Services\TaskService;
use App\Services\AuthService;
use App\Services\ResponseService;
use App\Services\ListService;
use App\Services\UserService;
use App\Services\ProjectService;


class TasksController extends Controller
{
    protected $taskService;
    protected $authService;
    protected $responseService;
    protected $listService;
    protected $projectService;
    protected $userService;


    public function __construct(TaskService $taskService, AuthService $authService, ResponseService $responseService, ListService $listService, ProjectService $projectService, UserService $userService)
    {
        $this->taskService = $taskService;
        $this->authService = $authService;
        $this->listService = $listService;
        $this->responseService = $responseService;
        $this->userService = $userService;
        $this->projectService = $projectService;
    }

    public function reorder(ReorderTasksRequest $request)
    {
        $projectId = $request->input('project_id');
        $project = $this->projectService->findProjectById($projectId);

        
        $listId = $request->input('list_id');
        $list = $this->listService->findStage($listId);

        $result = $this->taskService->reorderTask($request->all());
        // return $result;

        if (!$result) {
            return $this->responseService->messageResponse('Dropped position not found', false, 404);
        }

        $stages = $this->taskService->fetchTasksByListId($listId);

        return $this->responseService->successMessageDataResponse('List Updated Successfully', $stages, true, 200);
    }

    public function store(StoreTaskRequest $request, $id)
    {
        // new service code below

        if (!$this->authService->isAuthenticated($id)) {
            return $this->responseService->unauthorizedResponse();
        }

        $listId = $request->input('list_id');
        $stageExists = $this->listService->findStage($listId);

        if (!$stageExists) {
            return $this->responseService->messageResponse('Stage not found', false, 404);
        }

        $tasks = $this->taskService->createTask($request->all(), $id, $listId);

        return $this->responseService->successMessageDataResponse('Task Created Successfully', $tasks, true, 200);
    }

    public function update(Request $request)
    {

        // $user_id = $request->input('user_id');
        // $id = $request->input('id');
        // $project_id = $request->input('project_id');
        // $description = $request->input('description');

        // $task = Task::find($id);

        // if (!$task) {
        //     return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        // }

        // if ($user_id !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        // $task->description = $description;

        // $task->save();

        // $project = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        //     ->find($task->project_id);

        // $response = [
        //     'status' => true,
        //     'task' => $task,
        //     'project' => $project,
        //     'message' => "Desription Updated Successfully"
        // ];

        // return response()->json($response, 200);

        // new service code below
        $userId = $request->input('user_id');
        if (!$this->authService->isAuthenticated($userId)) {
            return $this->responseService->unauthorizedResponse();
        }

        return $this->taskService->updateTask($request->all());
    }

    public function assignTask(Request $request)
    {
        // $taskId = request()->input('task_id');
        // $task = Task::find($taskId);

        // if (!$task) {
        //     return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        // }

        // $owner_id = request()->input('owner_id');
        // if ($owner_id !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        // $addedTask = $this->taskService->assignUserToTask($request->all());

        // if (!$addedTask) {
        //     return response()->json(['status' => false, 'message' => 'Member not found'], 404);
        // }

        // $tasks = Task::with('users')->find($task->id);

        // $projects = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        //     ->find($task->project_id);

        // $response = [
        //     'status' => true,
        //     'task' => $tasks,
        //     'project' => $projects,
        //     'message' => "Task assigned Successfully"
        // ];

        // return response()->json($response, 200);

        // new service code below
        $userId = $request->input('owner_id');
        if (!$this->authService->isAuthenticated($userId)) {
            return $this->responseService->unauthorizedResponse();
        }

        $taskId = $request->input('task_id');
        $taskExists = $this->taskService->findTaskById($taskId);

        if (!$taskExists) {
            return $this->responseService->messageResponse('Task not found', false, 404);
        }

        $assignUser = $this->taskService->assignUserToTask($request->all());

        if (!$assignUser) {
            return $this->responseService->messageResponse('Member not found', false, 404);
        }

        $taskWithUsers = $this->taskService->fetchUsersOfTask($taskId);
        $project = $this->projectService->fetchDetailstWithProjectId($taskExists->project_id);
        return $this->responseService->successProjectTaskResponse('Task assigned Successfully', $project, $taskWithUsers, true, 200);
    }

    public function removeTask(Request $request)
    {

        // $taskId = request()->input('task_id');
        // $task = Task::find($taskId);

        // if (!$task) {
        //     return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        // }

        // $owner_id = request()->input('owner_id');
        // if ($owner_id !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        // $removedTask = $task->removeUser($request->all());
        // if (!$removedTask) {
        //     return response()->json(['status' => false, 'message' => 'Member not found'], 404);
        // }


        // $tasks = Task::with('users')->find($task->id);

        // $projects = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
        //     ->find($task->project_id);

        // $response = [
        //     'status' => true,
        //     'task' => $tasks,
        //     'project' => $projects,
        //     'message' => "Member removed Successfully"
        // ];

        // return response()->json($response, 200);

        // new service code below

        $userId = $request->input('owner_id');
        if (!$this->authService->isAuthenticated($userId)) {
            return $this->responseService->unauthorizedResponse();
        }

        $taskId = $request->input('task_id');
        $taskExists = $this->taskService->findTaskById($taskId);

        if (!$taskExists) {
            return $this->responseService->messageResponse('Task not found', false, 404);
        }

        $removeUser = $this->taskService->removeUserFromTask($request->all());
        if (!$removeUser) {
            return $this->responseService->messageResponse('Member not found', false, 404);
        }

        $taskWithUsers = $this->taskService->fetchUsersOfTask($taskId);
        $project = $this->projectService->fetchDetailstWithProjectId($taskExists->project_id);
        return $this->responseService->successProjectTaskResponse('Member removed Successfully', $project, $taskWithUsers, true, 200);
    }

    public function destroy($taskId, $userId)
    {
        // if ($userId !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        // $task = Task::find($id);

        // if (!$task) {
        //     return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        // }

        // $projectId = $task->project_id;

        // $project = Project::find($projectId);

        // if (!$project) {
        //     $response = [
        //         'status' => false,
        //         'message' => 'Project not found'
        //     ];
        //     return response()->json($response, 404);
        // }

        // $membersUnderTask = $task->users()->get();
        // foreach ($membersUnderTask as $member) {
        //     $task->users()->detach($member->id);
        // }
        // $task->delete();

        // $user = User::find($userId);
        // $projectsWithRelatedData = $user->getProjectsWithOwnerAndTasks();

        // $response = [
        //     'status' => true,
        //     'data' => $projectsWithRelatedData,
        //     'project_id' => $projectId,
        //     'message' => "Task deleted Successfully"
        // ];

        // return response()->json($response, 200);

        // new service code below

        if (!$this->authService->isAuthenticated($userId)) {
            return $this->responseService->unauthorizedResponse();
        }

        $taskExists = $this->taskService->findTaskById($taskId);

        if (!$taskExists) {
            return $this->responseService->messageResponse('Task not found', false, 404);
        }

        $projectId = $taskExists->project_id;
        $project = $this->projectService->fetchDetailstWithProjectId($projectId);

        if (!$project) {
            return $this->responseService->messageResponse('Project not found', false, 404);
        }

        $taskWithUsers = $this->taskService->fetchUsersOfTask($taskId);
        $this->taskService->removeMembersFromTask($taskExists, $taskWithUsers);

        $user = $this->userService->findUserById($userId);
        $projectsWithRelatedData = $this->userService->getProjectsFromUser($user);

        foreach ($projectsWithRelatedData as $project) {
            $project->is_owner = $project->user_id === $userId;
        }
        return $this->responseService->successMessageDataResponse('Task deleted Successfully', $projectsWithRelatedData, true, 200);
    }
}
