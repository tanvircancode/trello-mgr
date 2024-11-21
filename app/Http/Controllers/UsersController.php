<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Services\UserService;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function store(StoreUserRequest $request)
    {
        // return response()->json(['dd' => true, 'message' => 'checking now'], 200);

        // $input = $request->all();

        // $user = $this->userService->registerUser($input);

        // $data['id'] = $user->id;
        // $data['name'] = $user->name;
        // $data['token'] = $user->createToken('MyAppToken')->plainTextToken;
        // if ($user) {
        //     return $this->dependencyManagerService->responseService->successMessageDataResponse('Registration Successfully completed', $data, true, 200);
        // }
    }

    public function login(Request $request)
    {
        // dd($request->all());
        $input = $request->all();

        return $this->userService->userLogin($input);

        // from here old code

        // $credentials = [
        //     'email' => $input['email'],
        //     'password' => $input['password']
        // ];

        // if (Auth::attempt($credentials)) {
        //     // $request->session()->regenerate();
        //     $user = Auth::user();

        //     $token = $user->createToken('MyAppToken')->plainTextToken;
        //     $response = [
        //         'status' => true,
        //         'user' => $user,
        //         'token' => $token,
        //     ];

        //     return response()->json($response, 200);
        // }

        // $response = [
        //     'status' => false,
        //     'message' => 'Invalid Credentials',
        // ];
        // return response()->json($response, 404);
    }

    public function logout(Request $request)
    {
        // if ($request->user()->currentAccessToken()->delete()) {
        //     $response = [
        //         'status' => true,
        //         'message' => 'Logged out successfully'
        //     ];
        //     return response()->json($response, 200);
        // } else {
        //     return response()->json(['status' => false], 404);
        // }

        //  new service code below
        return $this->userService->logout($request->user());
    }

    public function me()
    {
        // if (!Auth::user()) {
        //     return response()->json(['status' => false], 403);
        // }

        // $user = Auth::user();

        // $response = [
        //     'user' => $user,
        //     'status' => true,
        // ];
        // return response()->json($response, 200);

        //  new service code below
        return $this->userService->getUserDetails();
    }

    public function show($id)
    {
        // if ($id !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        // $user = User::find($id);

        // if (!$user) {
        //     $response = [
        //         'status' => false,
        //         'message' => 'User not found'
        //     ];
        //     return response()->json($response, 404);
        // }
        // $projectsWithRelatedData = $user->getProjectsWithOwnerAndTasks();

        // $response = [
        //     'status' => true,
        //     'data' => $projectsWithRelatedData,

        // ];

        // return response()->json($response, 200);

        //new services code from here show func


        return $this->userService->showUserProjects($id);
    }

    public function searchUsers(Request $request)
    {
        // $searchTerm = $request->input('searchTerm');
        // $projectId = $request->input('project_id');

        // $project = Project::find($projectId);

        // if (!$project) {
        //     $response = [
        //         'status' => false,
        //         'message' => 'Project not found'
        //     ];
        //     return response()->json($response, 404);
        // }

        // if ($project->user_id !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        // $users = User::where('name', 'like', "%{$searchTerm}%")
        //     ->orWhere('email', 'like', "%{$searchTerm}%")
        //     ->get();

        // $users = $users->map(function ($user) use ($projectId) {
        //     $user->isMember = $user->isMemberOfProject($projectId);
        //     return $user;
        // });

        // $response = [
        //     'status' => true,
        //     'users' => $users,
        // ];

        // return response()->json($response, 200);

        //new services code from here show func
        $input = $request->all();
        return $this->userService->searchUsers($input);
    }



    public function addMember(Request $request)
    {
        // $projectId = $request->input('project_id');
        // $userId = $request->input('user_id');
        // $ownerId = $request->input('owner_id');

        // if ($ownerId !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        // $user = User::find($userId);
        // if (!$user) {
        //     $response = [
        //         'status' => false,
        //         'message' => 'User not found'
        //     ];
        //     return response()->json($response, 404);
        // }

        // if (!$user->addToProject($projectId)) {

        //     $response = [
        //         'status' => false,
        //         'message' => 'User is already a member of this project.',
        //     ];
        //     return response()->json($response, 400);
        // }
        // $project = Project::with('members', 'stages', 'stages.tasks', 'stages.tasks.users', 'stages.tasks.labels', 'stages.tasks.priorities', 'stages.tasks.checklists', 'stages.tasks.checklists.checklistitems')
        //     ->find($projectId);

        // $response = [
        //     'status' => true,
        //     'project' => $project,
        //     'message' => "Member Added Successfully"
        // ];
        // return response()->json($response, 200);


        // new services code from here show func
        $input = $request->all();
        return $this->userService->addMember($input);
    }

    public function removeMember($projectId, $userId)
    {
        return $this->userService->removeMemberFromProject($projectId, $userId);
        // $project = Project::find($projectId);

        // if (!$project) {
        //     $response = [
        //         'status' => false,
        //         'message' => 'Project not found'
        //     ];
        //     return response()->json($response, 404);
        // }

        // if ($project->user_id !== Auth::user()->id) {
        //     return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        // }

        // $user = User::find($userId);
        // if (!$user) {
        //     $response = [
        //         'status' => false,
        //         'message' => 'User not found'
        //     ];
        //     return response()->json($response, 404);
        // }

        // $project->members()->detach($userId);

        // $stagesUnderProject = $project->stages()->get();

        // foreach ($stagesUnderProject as $stage) {
        //     $tasksUnderStage = $stage->tasks()->get();
        //     foreach ($tasksUnderStage as $task) {
        //         if ($task->users->contains($userId)) {
        //             $task->users()->detach($userId);
        //         }
        //     }
        // }

        // $project = Project::with('members', 'stages', 'stages.tasks', 'stages.tasks.users', 'stages.tasks.labels', 'stages.tasks.priorities', 'stages.tasks.checklists', 'stages.tasks.checklists.checklistitems')
        //     ->find($projectId);

        // $response = [
        //     'status' => true,
        //     'project' => $project,
        //     'message' => "Member Removed Successfully"
        // ];

        // return response()->json($response, 200);
    }
}
