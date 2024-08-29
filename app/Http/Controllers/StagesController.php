<?php

namespace App\Http\Controllers;
use App\Http\Requests\StoreStageRequest;
use App\Http\Requests\MoveStageRequest;
use App\Http\Controllers\Controller;
use App\Models\Stage;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StagesController extends Controller
{
    public function store(StoreStageRequest $request, $id)
    {
        if ($id !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        // new code
        $project_id = $request->input('project_id');
        $maxPosition = Stage::where('project_id', $project_id)
            ->max('position');

        $newPosition = $maxPosition ? $maxPosition + 1 : 1;

        $requestData = $request->all();
        $requestData['position'] = $newPosition;

        $stage = Stage::createStage($requestData, $id);

        if (!$stage) {
            return response()->json(['status' => false, 'message' => 'Project not found'], 404);
        }

        $stages = Project::with([
            'members',
            'stages' => function ($query) {
                $query->orderBy('position', 'asc');
            },
            'stages.tasks' => function ($query) {
                $query->orderBy('created_at', 'asc');
            },
            // 'stages.tasks.users',
            'stages.tasks.labels',
            'stages.tasks.priorities',
            'stages.tasks.checklists',
            'stages.tasks.checklists.checklistitems'
        ])->find($stage->project_id);

        $response = [
            'status' => true,
            'data' => $stages,
            'message' => "List Created Successfully"
        ];

        return response()->json($response, 200);
    }

    public function moveStage(MoveStageRequest $request)
    {
        $projectId = $request->input('project_id');
        $userId = $request->input('user_id');

        if ($userId !== Auth::user()->id) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }

        $stageModel = new Stage();
        $stage = $stageModel->updateStage($request->all());

        if (!$stage) {
            return response()->json(['status' => false, 'message' => 'Stage not found'], 404);
        }

        $stages = Project::with([
            'members',
            'stages' => function ($query) {
                $query->orderBy('position', 'asc');
            },
            
            'stages.tasks' => function ($query) {
                $query->orderBy('created_at', 'asc');
            },
            // 'stages.tasks.users',
            'stages.tasks.labels',
            'stages.tasks.priorities',
            'stages.tasks.checklists',
            'stages.tasks.checklists.checklistitems'
        ])->find($projectId);

        $response = [
            'status' => true,
            'data' => $stages,
            'message' => "List Updated Successfully"
        ];

        return response()->json($response, 200);
    }
}
