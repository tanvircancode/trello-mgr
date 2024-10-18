<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStageRequest;
use App\Http\Requests\MoveStageRequest;
use App\Http\Controllers\Controller;
use App\Models\Stage;
use App\Models\Project;
use App\Services\ListService;
use App\Services\ProjectService;
use App\Services\AuthService;
use App\Services\ResponseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StagesController extends Controller
{
    protected ?ListService $listService = null;
    protected ?ProjectService $projectService = null;
    protected ?AuthService $authService = null;
    protected ?ResponseService $responseService = null;

    public function __construct(ListService $listService, ProjectService $projectService, AuthService $authService, ResponseService $responseService)
    {
        $this->listService = $listService;
        $this->projectService = $projectService;
        $this->authService = $authService;
    }

    public function store(StoreStageRequest $request, $id)
    {
        if(!$this->authService->isAuthenticated($id)) {
            return response()->json(['status' => false, 'message' => 'Unauthorized access'], 403);
        }
        
        //List Service starts from here
        $stage = $this->listService->store($request->all());

        if (!$stage) {
            return response()->json(['status' => false, 'message' => 'Project not found'], 404);
        }

        $stages = $this->projectService->getAll($request->all());

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
