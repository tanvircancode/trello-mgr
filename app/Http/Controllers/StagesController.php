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
use App\Services\ModelService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StagesController extends Controller
{
    protected ?ListService $listService = null;
    protected ?ProjectService $projectService = null;
    protected ?AuthService $authService = null;
    protected ?ResponseService $responseService = null;
    protected ?ModelService $modelService = null;

    public function __construct(ListService $listService, ProjectService $projectService, AuthService $authService, ResponseService $responseService,  ModelService $modelService)
    {
        $this->listService = $listService;
        $this->projectService = $projectService;
        $this->authService = $authService;
        $this->responseService = $responseService;
        $this->modelService = $modelService;
    }

    public function store(StoreStageRequest $request, $id)
    {
        if (!$this->authService->isAuthenticated($id)) {
            return $this->responseService->unauthorizedResponse();
        }

        //List Service starts from here
        $stage = $this->listService->store($request->all());

        if (!$stage) {
            return $this->responseService->notFoundResponse('Project not found');
        }

        $projectId = $request->input('project_id');
        $stages = $this->projectService->getAll($projectId);

        return $this->responseService->successResponse('List Created Successfully', $stages);
    }

    public function moveStage(MoveStageRequest $request)
    {
        $projectId = $request->input('project_id');
        $userId = $request->input('user_id');

        if (!$this->authService->isAuthenticated($userId)) {
            return $this->responseService->unauthorizedResponse();
        }

        // $stageModel = new Stage();
        $stageModel = $this->modelService->createModelInstance(Stage::class);
        $stage = $stageModel->updateStage($request->all());

        if (!$stage) {
            return $this->responseService->notFoundResponse('Stage not found');
        }

        $stages = $this->projectService->getAll($projectId);

        return $this->responseService->successResponse('List Updated Successfully', $stages);
    }
}
