<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ListService;
use App\Http\Requests\StoreStageRequest;
use App\Http\Requests\MoveStageRequest;

class StagesController extends Controller
{
    protected $listService;

    public function __construct(ListService $listService)
    {
        $this->listService = $listService;
    }
    public function store(StoreStageRequest $request, $id)
    {
        return $this->listService->storeStage($request->all(), $id);

        // if (!$this->authService->isAuthenticated($id)) {
        //     return $this->responseService->unauthorizedResponse();
        // }

        // //List Service starts from here
        // $stage = $this->listService->store($request->all());

        // if (!$stage) {
        //     return $this->responseService->messageResponse('Project not found', false, 404);
        // }

        // $projectId = $request->input('project_id');
        // $stages = $this->projectService->stagesOfProject($projectId);

        // return $this->responseService->successMessageDataResponse('List Created Successfully', $stages, true, 200);
    }

    public function moveStage(MoveStageRequest $request)
    {
        return $this->listService->updateStage($request->all());
    }
}
