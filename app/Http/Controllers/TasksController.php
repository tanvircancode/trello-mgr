<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Models\Project;
use App\Models\Task;
use App\Models\Stage;
use App\Models\User;
use Illuminate\Http\Request;
use App\Services\DependencyManagerService;
use Illuminate\Support\Facades\Auth;

class TasksController extends Controller
{
    protected ?DependencyManagerService $dependencyManagerService = null;

    public function __construct(DependencyManagerService $dependencyManagerService)
    {
        $this->dependencyManagerService = $dependencyManagerService;
    }

    public function store(StoreTaskRequest $request, $id)
    {
        // return $this->dependencyManagerService->taskService->storeTask($request->all(), $id);
        // new service code below


        if (!$this->dependencyManagerService->authService->isAuthenticated($id)) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $listId = $request->input('list_id');
        $stageExists = $this->dependencyManagerService->listService->findStage($listId);

        if (!$stageExists) {
            return $this->dependencyManagerService->responseService->messageResponse('Stage not found', false, 404);
        }

        // if ($id !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }
        $result = $this->dependencyManagerService->taskService->createTask($request->all(), $id);
        if (!$result) {
            return $this->dependencyManagerService->responseService->messageResponse($result['message'], $result['status'], $result['statusCode']);
        }

        $listId = $request->input('list_id');

        $task = Task::createTask($request->all(), $id);

        if (!$task) {
            return response()->json(['status' => false, 'message' => 'Stage not found'], 404);
        }

        $tasks = Project::with([
            'members',
            'stages' => function ($query) {
                $query->orderBy('created_at', 'asc'); // Order stages by created_at in ascending order
            },
            'stages.tasks' => function ($query) {
                $query->orderBy('created_at', 'asc');
            },
            // 'stages.tasks.users', 
            'stages.tasks.labels',
            'stages.tasks.priorities',
            'stages.tasks.checklists',
            'stages.tasks.checklists.checklistitems'
        ])->whereHas('stages', function ($query) use ($list_id) {
            $query->where('id', $list_id);
        })->first();

        $response = [
            'status' => true,
            'data' => $tasks,
            'message' => "Task Created Successfully"
        ];

        return response()->json($response, 200);
    }

    public function update(Request $request)
    {

        $user_id = $request->input('user_id');
        $id = $request->input('id');
        $project_id = $request->input('project_id');
        $description = $request->input('description');


        $task = Task::find($id);

        if (!$task) {
            return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        }

        if ($user_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }


        $task->description = $description;

        $task->save();

        $project = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
            ->find($task->project_id);

        $response = [
            'status' => true,
            'task' => $task,
            'project' => $project,
            'message' => "Desription Updated Successfully"
        ];


        return response()->json($response, 200);
    }

    public function assignTask(Request $request)
    {

        $taskId = request()->input('task_id');
        $task = Task::find($taskId);

        if (!$task) {
            return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        }

        $owner_id = request()->input('owner_id');
        if ($owner_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $addedTask = $task->assignUser($request->all());
        if (!$addedTask) {
            return response()->json(['status' => false, 'message' => 'Member not found'], 404);
        }

        $tasks = Task::with('users')->find($task->id);

        $projects = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
            ->find($task->project_id);

        $response = [
            'status' => true,
            'task' => $tasks,
            'project' => $projects,
            'message' => "Task assigned Successfully"
        ];


        return response()->json($response, 200);
    }

    public function removeTask(Request $request)
    {

        $taskId = request()->input('task_id');
        $task = Task::find($taskId);

        if (!$task) {
            return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        }

        $owner_id = request()->input('owner_id');
        if ($owner_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $removedTask = $task->removeUser($request->all());
        if (!$removedTask) {
            return response()->json(['status' => false, 'message' => 'Member not found'], 404);
        }


        $tasks = Task::with('users')->find($task->id);

        $projects = Project::with('members', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems')
            ->find($task->project_id);

        $response = [
            'status' => true,
            'task' => $tasks,
            'project' => $projects,
            'message' => "Task assigned Successfully"
        ];


        return response()->json($response, 200);
    }

    public function destroy($id, $userId)
    {
        if ($userId !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $task = Task::find($id);

        if (!$task) {
            return response()->json(['status' => false, 'message' => 'Task not found'], 404);
        }

        $projectId = $task->project_id;

        $project = Project::find($projectId);

        if (!$project) {
            $response = [
                'status' => false,
                'message' => 'Project not found'
            ];
            return response()->json($response, 404);
        }

        $membersUnderTask = $task->users()->get();
        foreach ($membersUnderTask as $member) {
            $task->users()->detach($member->id);
        }
        $task->delete();

        $user = User::find($userId);
        $projectsWithRelatedData = $user->getProjectsWithOwnerAndTasks();

        $response = [
            'status' => true,
            'data' => $projectsWithRelatedData,
            'project_id' => $projectId,
            'message' => "Task deleted Successfully"
        ];


        return response()->json($response, 200);
    }
}
