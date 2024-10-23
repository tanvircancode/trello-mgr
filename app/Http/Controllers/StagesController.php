<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\Stage;
use App\Services\DependencyManagerService;
use App\Http\Requests\StoreStageRequest;
use App\Http\Requests\MoveStageRequest;

class StagesController extends Controller
{
    protected ?DependencyManagerService $dependencyManager = null;

    public function __construct(DependencyManagerService $dependencyManager)
    {
        $this->dependencyManager = $dependencyManager;
    }

    public function store(StoreStageRequest $request, $id)
    {
        if (!$this->dependencyManager->authService->isAuthenticated($id)) {
            return $this->dependencyManager->responseService->unauthorizedResponse();
        }

        //List Service starts from here
        $stage = $this->dependencyManager->listService->store($request->all());

        if (!$stage) {
            return $this->dependencyManager->responseService->messageResponse('Project not found', false, 404);
        }

        $projectId = $request->input('project_id');
        $stages = $this->dependencyManager->projectService->getAll($projectId);

        return $this->dependencyManager->responseService->successMessageDataResponse('List Created Successfully', $stages, true, 200);
    }

    public function moveStage(MoveStageRequest $request)
    {
        $projectId = $request->input('project_id');
        $userId = $request->input('user_id');

        if (!$this->dependencyManager->authService->isAuthenticated($userId)) {
            return $this->dependencyManager->responseService->unauthorizedResponse();
        }

        $stageModel = $this->dependencyManager->modelService->createModelInstance(Stage::class);
        $stage = $stageModel->updateStage($request->all());

        if (!$stage) {
            return $this->dependencyManager->responseService->messageResponse('Stage not found', false, 404);
        }

        $stages = $this->dependencyManager->projectService->getAll($projectId);

        return $this->dependencyManager->responseService->successMessageDataResponse('List Updated Successfully', $stages, true, 200);
    }
}
