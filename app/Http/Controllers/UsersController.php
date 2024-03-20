<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Models\Project;
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


    //new
    public function userProjectDetails($userId)
    {
        $user = User::getUserProjects($userId);

        // Access projects and identify owners (manually)
        // foreach ($user->projects as $project) {
        //     $isOwner = $project->user_id === $userId; // Check if user_id matches in projects table
        //     echo "Project: " . $project->title . ", Role: " . ($isOwner ? 'Owner' : 'Member');
        // }
        return $user;
    }

    public function getTaskIds($userId)
    {
        $user = User::with('tasks.users')->find($userId);

        $taskIds = $user->tasks->whereIn('user_id', [$userId])->pluck('id'); // Filter and extract IDs
        $response = [
            'status' => true,
            'data' => $taskIds
        ];

        return response()->json($response, 200);
    }

    //search users
    public function searchUsers(Request $request)
    {
        $searchTerm = $request->input('searchTerm');
        $projectId = $request->input('projectId');

        $users = User::where('name', 'like', "%{$searchTerm}%")
            ->orWhere('email', 'like', "%{$searchTerm}%")
            ->get();

        // Additional filtering and sorting based on your needs

        $users = $users->map(function ($user) use ($projectId) {
            $user->isMember = $user->isMemberOfProject($projectId); // Use custom method
            return $user;
        });

        return response()->json([
            'users' => $users,
        ], 200);
    }


    public function addMember(Request $request)
    {
        $projectId = $request->input('project_id');
        $userId = $request->input('user_id');

        $project = Project::findOrFail($projectId);

        if (!$project) {
            $response = [
                'status' => false,
                'message' => 'Project not found'
            ];
            return response()->json($response, 404);
        }

        $user = User::findOrFail($userId);

        if (!$user) {
            $response = [
                'status' => false,
                'message' => 'User not found'
            ];
            return response()->json($response, 404);
        }

        if ($project->members()->where('user_id', $userId)->exists()) {
            return response()->json([
                'status' => false,
                'message' => 'User is already a member of this project.',
            ], 422);
        }

        $memberId = Str::uuid();

        $project->members()->attach($userId, ['id' => $memberId]);

        $response = [
            'status' => true,
            'message' => 'Member Added Successfully'
        ];

        return response()->json($response, 200);
    }
}
