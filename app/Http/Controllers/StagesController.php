<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ListService;
use App\Http\Requests\ReorderTasksRequest;
use App\Services\ResponseService;
use App\Services\ProjectService;
use App\Http\Requests\StoreStageRequest;
use App\Http\Requests\MoveStageRequest;
use Illuminate\Http\Client\Request;

class StagesController extends Controller
{
    protected $listService;
    protected $responseService;
    protected $projectService;


    public function __construct(ListService $listService, ResponseService $responseService, ProjectService $projectService)
    {
        $this->listService = $listService;
        $this->responseService = $responseService;
        $this->projectService = $projectService;
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
        // print_r($request->all());
        // exit;
        return $this->listService->updateStage($request->all());
    }

    public function reorder(ReorderTasksRequest $request)
    {
        // print_r($request->all());return;
        $projectId = $request->input('project_id');
        $project = $this->projectService->findProjectById($projectId);

        if (!$project) {
            return $this->responseService->messageResponse('Project not found', false, 404);
        }

        $result = $this->listService->reorderStage($request->all());
        // return $result;

        if (!$result) {
            return $this->responseService->messageResponse('Dropped position not found', false, 404);
        }

        $stages = $this->projectService->stagesOfProject($projectId);

        return $this->responseService->successMessageDataResponse('List Updated Successfully', $stages, true, 200);
    }
}
