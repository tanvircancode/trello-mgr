<?php

namespace App\Services;

use App\Models\Stage;
use App\Services\ResponseService;
use App\Services\AuthService;
use App\Services\ProjectService;
use App\Repositories\StageRepository;
use App\Repositories\ProjectRepository;

class ListService
{
  protected $projectService;
  protected $userRepository;
  protected $projectRepository;
  protected $stageRepository;
  protected $responseService;
  protected $authService;

  public function __construct(
    ProjectService $projectService,
    ProjectRepository $projectRepository,
    AuthService $authService,
    ResponseService $responseService,
    StageRepository $stageRepository,
  ) {
    $this->projectService = $projectService;
    $this->projectRepository = $projectRepository;
    $this->responseService = $responseService;
    $this->authService = $authService;
    $this->stageRepository = $stageRepository;
  }

  public function findStage($id)
  {
    return $this->stageRepository->findById($id);
  }

  public function storeStage(array $data, $userId)
  {

    if (!$this->authService->isAuthenticated($userId)) {
      return $this->responseService->unauthorizedResponse();
    }

    $projectId = $data['project_id'];
    $maxPosition = Stage::where('project_id', $projectId)->count();

    $newPosition = $maxPosition ? $maxPosition + 1 : 1;

    $data['position'] = $newPosition;

    $project = $this->projectRepository->findById($projectId);

    if (!$project) {
      return $this->responseService->messageResponse('Project not found', false, 404);
    }

    $this->stageRepository->createStage($data);

    $stages = $this->projectRepository->projectData($projectId);

    return $this->responseService->successMessageDataResponse('List Created Successfully', $stages, true, 200);
  }

  public function updateStage($data)
  {
    $userId = $data['user_id'];
    $projectId = $data['project_id'];

    if (!$this->authService->isAuthenticated($userId)) {
      return $this->responseService->unauthorizedResponse();
    }
    

    $stage = $this->stageRepository->changeStagePosition($data);
    if (!$stage) {
      return $this->responseService->messageResponse('Stage not found', false, 404);
    }

    $stages = $this->projectService->stagesOfProject($projectId);

    return $this->responseService->successMessageDataResponse('List Updated Successfully', $stages, true, 200);
  }

  public function reorderStage($data)
  {
    $projectId = $data['project_id'];
    $start = $data['start'];
    $end = $data['end'];


    $stages = $this->stageRepository->fetchStagesOfAProject($projectId);
    // return $stages;

    if ($start > $stages->count() || $end > $stages->count()) {
      return;
    }

    $stagesArray = $stages->toArray();

    $movedTask = array_splice($stagesArray, $start, 1)[0];

    array_splice($stagesArray, $end, 0, [$movedTask]);
    // return $stagesArray;

    $this->stageRepository->updatePosition($stagesArray);

    return true;
  }
}
