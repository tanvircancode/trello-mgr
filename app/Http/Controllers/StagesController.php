<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Stage;
use App\Services\DependencyManagerService;
use App\Http\Requests\StoreStageRequest;
use App\Http\Requests\MoveStageRequest;

class StagesController extends Controller
{
    protected ?DependencyManagerService $dependencyManagerService = null;

    public function __construct(DependencyManagerService $dependencyManagerService)
    {
        $this->dependencyManagerService = $dependencyManagerService;
    }

    public function store(StoreStageRequest $request, $id)
    {
        return $this->dependencyManagerService->listService->storeStage($request->all(), $id);

        // if (!$this->dependencyManagerService->authService->isAuthenticated($id)) {
        //     return $this->dependencyManagerService->responseService->unauthorizedResponse();
        // }

        // //List Service starts from here
        // $stage = $this->dependencyManagerService->listService->store($request->all());

        // if (!$stage) {
        //     return $this->dependencyManagerService->responseService->messageResponse('Project not found', false, 404);
        // }

        // $projectId = $request->input('project_id');
        // $stages = $this->dependencyManagerService->projectService->stagesOfProject($projectId);

        // return $this->dependencyManagerService->responseService->successMessageDataResponse('List Created Successfully', $stages, true, 200);
    }

    public function moveStage(MoveStageRequest $request)
    {
        return $this->dependencyManagerService->listService->updateStage($request->all());
    }
}
