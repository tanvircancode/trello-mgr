<?php

namespace App\Services;

use App\Models\Stage;
use App\Repositories\DependencyManagerRepository;
use App\Services\DependencyManagerService;

class ListService
{
  protected $stageModel;
  protected DependencyManagerRepository $dependencyManagerRepository;
  protected DependencyManagerService $dependencyManagerService;

  public function __construct(Stage $stageModel, DependencyManagerRepository $dependencyManagerRepository, DependencyManagerService $dependencyManagerService)
  {
    $this->stageModel = $stageModel;
    $this->dependencyManagerRepository = $dependencyManagerRepository;
    $this->dependencyManagerService = $dependencyManagerService;
  }

  public function storeStage(array $data, $userId)
  {
    if (!$this->dependencyManagerService->authService->isAuthenticated($userId)) {
      return $this->dependencyManagerService->responseService->unauthorizedResponse();
    }

    $projectId = $data['project_id'];
    $maxPosition = Stage::where('project_id', $projectId)->count();

    $newPosition = $maxPosition ? $maxPosition + 1 : 1;

    $data['position'] = $newPosition;

    $project = $this->dependencyManagerRepository->projectRepository->findById($projectId);

    if (!$project) {
      return $this->dependencyManagerService->responseService->messageResponse('Project not found', false, 404);
    }

    $this->dependencyManagerRepository->stageRepository->createStage($data);

    $stages = $this->dependencyManagerRepository->projectRepository->projectData($projectId);

    return $this->dependencyManagerService->responseService->successMessageDataResponse('List Created Successfully', $stages, true, 200);
  }

  public function updateStage($data)
  {
    $userId = $data['user_id'];
    $projectId = $data['project_id'];

    if (!$this->dependencyManagerService->authService->isAuthenticated($userId)) {
      return $this->dependencyManagerService->responseService->unauthorizedResponse();
    }

    $stage = $this->dependencyManagerRepository->stageRepository->changeStagePosition($data);
    if (!$stage) {
      return $this->dependencyManagerService->responseService->messageResponse('Stage not found', false, 404);
    }
    $stages = $this->dependencyManagerService->projectService->stagesOfProject($projectId);

    return $this->dependencyManagerService->responseService->successMessageDataResponse('List Updated Successfully', $stages, true, 200);
  }
}
