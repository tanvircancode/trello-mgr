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
            return $this->dependencyManager->responseService->notFoundResponse('Project not found');
        }

        $projectId = $request->input('project_id');
        $stages = $this->dependencyManager->projectService->getAll($projectId);

        return $this->dependencyManager->responseService->successResponse('List Created Successfully', $stages);
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
            return $this->dependencyManager->responseService->notFoundResponse('Stage not found');
        }

        $stages = $this->dependencyManager->projectService->getAll($projectId);

        return $this->dependencyManager->responseService->successResponse('List Updated Successfully', $stages);
    }
}
