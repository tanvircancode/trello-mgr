<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    public function store(StoreUserRequest $request)
    {
        $input = $request->all();

        $existingUser = User::where('email', $input['email'])->first();
        if ($existingUser) {
            $response = [
                'status' => false,
                'statusCode' => 404,
                'message' => 'Email is already registered',
            ];
            return response()->json($response, 401); // 400 Bad Request
        }


        $input['password'] = bcrypt($input['password']);

        if (empty($input['token']) || $input['token'] != env('REGISTER_TOKEN')) {
            $response = [
                'status' => false,
                'message' => 'You are not authorized'
            ];
            return response()->json($response, 404);
        }

        $user = User::create($input);

        $data['id'] = $user->id;
        $data['name'] = $user->name;
        $data['token'] = $user->createToken('MyAppToken')->plainTextToken;

        $response = [
            'status' => true,
            'data' => $data,
        ];

        return response()->json($response, 200);
    }

    public function login(Request $request)
    {
        $input = $request->all();

        $credentials = [
            'email' => $input['email'],
            'password' => $input['password']
        ];

        if (Auth::attempt($credentials)) {
            // $request->session()->regenerate();
            $user = Auth::user();

            $token = $user->createToken('MyAppToken')->plainTextToken;
            $response = [
                'status' => true,
                'user' => $user,
                'token' => $token,
            ];

            return response()->json($response, 200);
        }

        $response = [
            'status' => false,
            'message' => 'Invalid Credentials'
        ];
        return response()->json($response, 404);
    }

    public function logout(Request $request)
    {
        if ($request->user()->currentAccessToken()->delete()) {
            $response = [
                'status' => true,
                'message' => 'Logged out successfully'
            ];
            return response()->json($response, 200);
        } else {
            return response()->json(['status' => false], 404);
        }
    }

    public function me(Request $request)
    {
        if (!Auth::user()) {
            return response()->json(['status' => false], 403);
        }

        $user = Auth::user();

        $response = [
            'user' => $user,
            'status' => true,
        ];
        return response()->json($response, 200);
    }

    public function show($id)
    {

        if ($id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            $response = [
                'status' => false,
                'message' => 'User not found'
            ];
            return response()->json($response, 404);
        }
        $projectsWithRelatedData = $user->getProjectsWithOwnerAndTasks();

        $response = [
            'status' => true,
            'data' => $projectsWithRelatedData
        ];

        return response()->json($response, 200);
    }

    //search users
    public function searchUsers(Request $request)
    {
        $searchTerm = $request->input('searchTerm');
        $projectId = $request->input('project_id');

        $project = Project::find($projectId);

        if (!$project) {
            $response = [
                'status' => false,
                'message' => 'Project not found'
            ];
            return response()->json($response, 404);
        }

        if ($project->user_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $users = User::where('name', 'like', "%{$searchTerm}%")
            ->orWhere('email', 'like', "%{$searchTerm}%")
            ->get();

        $users = $users->map(function ($user) use ($projectId) {
            $user->isMember = $user->isMemberOfProject($projectId);
            return $user;
        });

        $response = [
            'status' => true,
            'users' => $users,
        ];

        return response()->json($response, 200);
    }

   


    public function addMember(Request $request)
    {
        $projectId = $request->input('project_id');
        $userId = $request->input('user_id');
        $ownerId = $request->input('owner_id');

        if ($ownerId !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $user = User::find($userId);
        if (!$user) {
            $response = [
                'status' => false,
                'message' => 'User not found'
            ];
            return response()->json($response, 404);
        }

        if (!$user->addToProject($projectId)) {

            $response = [
                'status' => false,
                'message' => 'User is already a member of this project.',
            ];
            return response()->json($response, 400);
        }
        $project = Project::with('members','tasks', 'tasks.users','tasks.labels' , 'tasks.priorities', 'tasks.checklists','tasks.checklists.checklistitems')
        ->find($projectId);

        $response = [
            'status' => true,
            'project' => $project,
            'message' => "Member Added Successfully"
        ];

        return response()->json($response, 200);
    }

    public function removeMember( $projectId, $userId)
    {
        $project = Project::find($projectId);

        if (!$project) {
            $response = [
                'status' => false,
                'message' => 'Project not found'
            ];
            return response()->json($response, 404);
        }
       
        if ($project->user_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $user = User::find($userId);
        if (!$user) {
            $response = [
                'status' => false,
                'message' => 'User not found'
            ];
            return response()->json($response, 404);
        }

        $project->members()->detach($userId);
        $tasksUnderProject = $project->tasks()->get();

        foreach($tasksUnderProject as $task) {
            if ($task->users->contains($userId)) {
                $task->users()->detach($userId);
            }
        }

        $project = Project::with('members','tasks', 'tasks.users','tasks.labels' , 'tasks.priorities', 'tasks.checklists','tasks.checklists.checklistitems')
        ->find($projectId);

        $response = [
            'status' => true,
            'project' => $project,
            'message' => "Member Removed Successfully"
        ];

        return response()->json($response, 200);
    }
}
