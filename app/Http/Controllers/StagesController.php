<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStageRequest;
use App\Http\Controllers\Controller;
use App\Models\Stage;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StagesController extends Controller
{
    //
    public function store(StoreStageRequest $request, $id)
    {
        if ($id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $stage = Stage::createStage($request->all(), $id);
        if (!$stage) {
            return response()->json(['status' => false, 'message' => 'Project not found'], 404);
        }

        $stages = Project::with([
            'members',
            'stages',
            // For now below line are commented, will be change next
            // 'stages.tasks' => function($query) {
            //     $query->orderBy('created_at', 'asc');
            // },

            // 'stages.tasks.users',
            // 'stages.tasks.labels', 
            // 'stages.tasks.priorities', 
            // 'stages.tasks.checklists', 
            // 'stages.tasks.checklists.checklistitems'
        ])->find($stage->project_id);

        $response = [
            'status' => true,
            'data' => $stages,
            'chk' => "is checking",
            'message' => "List Created Successfully"
        ];

        return response()->json($response, 200);
    }
}
