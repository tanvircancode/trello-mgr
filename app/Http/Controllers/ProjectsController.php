<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;


class ProjectsController extends Controller
{
    //
    public function store(StoreProjectRequest $request)
    {
        $input = $request->all();

        if ($input['user_id'] !== Auth::user()->id) {  
            return response()->json(['status' => false, 'message' => "Unauthorized Access"], 403);
        }

        $project = Project::create($input);

        if ($project) {
            $user = Auth::user();
            $projects = User::with('project')->find($user->id);
            $project->members()->attach($input['user_id'], ['id' => Str::uuid()]);

            $response = [
                'status' => true,
                'data' => $projects,
                'message' => "Project created Successfully"
            ];

            return response()->json($response, 200);
        }

        $response = [
            'status' => false,
            'message' => 'Project not created'
        ];
        return response()->json($response, 404);
    }
}
