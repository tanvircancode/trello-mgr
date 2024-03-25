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
            $user = User::find($input['user_id']);
            // $projects = User::with('project')->find($user->id);

            $project->members()->attach($input['user_id'], ['id' => Str::uuid()]);
            $projectsWithRelatedData = $user->getProjectsWithOwnerAndTasks();

            $response = [
                'status' => true,
                'data' => $projectsWithRelatedData,
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

    public function showMembers($id)
    {
        $project = Project::find($id);

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

        $memberArray = $project->getMembers();

        $response = [
            'status' => true,
            'users' => $memberArray,
            'message' => "Member fetched Successfully"
        ];

        return response()->json($response, 200);
    }

    public function destroy($id)
    {
        $project = Project::find($id);
        $user_id = $project->user_id;

        if (!$project) {
            $response = [
                'status' => false,
                'message' => 'Project not found'
            ];
            return response()->json($response, 404);
        }

        if ($user_id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $tasksUnderProject = $project->tasks()->get();

        foreach ($tasksUnderProject as $task) {

            $task->users()->detach();
        }

        $project->tasks()->delete();

        $project->members()->detach(); 

        $project->delete();

        $user = User::find($user_id);
        $projectsWithRelatedData = $user->getProjectsWithOwnerAndTasks();

        $response = [
            'status' => true,
            'data' => $projectsWithRelatedData,
            'message' => "Project Deleted Successfully"
        ];


        return response()->json($response, 200);
    }

    public function leaveProject($id, $userId)
    {

        $project = Project::find($id);

        if (!$project) {
            $response = [
                'status' => false,
                'message' => 'Project not found'
            ];
            return response()->json($response, 404);
        }

        if ($userId !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $tasksUnderProject = $project->tasks()->get();

        foreach ($tasksUnderProject as $task) {
            if ($task->users->contains($userId)) {
                $task->users()->detach($userId);
            }
        }

        $project->members()->detach($userId); 

        $user = User::find($userId);
        $projectsWithRelatedData = $user->getProjectsWithOwnerAndTasks();

        $response = [
            'status' => true,
            'data' => $projectsWithRelatedData,
            'message' => "Left Project Successfully"
        ];


        return response()->json($response, 200);
    }
}
