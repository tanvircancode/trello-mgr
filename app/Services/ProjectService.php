<?php

namespace App\Services;

use App\Models\Project;
use App\Services\DependencyManagerService;
use App\Repositories\DependencyManagerRepository;

class ProjectService
{
    protected DependencyManagerService $dependencyManagerService;
    protected DependencyManagerRepository $dependencyManagerRepository;

    public function __construct(DependencyManagerService $dependencyManagerService, DependencyManagerRepository $dependencyManagerRepository)
    {
        $this->dependencyManagerService = $dependencyManagerService;
        $this->dependencyManagerRepository = $dependencyManagerRepository;
    }

    public function store(array $projectData)
    {
        $userId = $projectData['user_id'];
        $projectId  =  $projectData['project_id'];

        if (!$this->dependencyManagerService->authService->isAuthenticated($userId)) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $project = $this->dependencyManagerRepository->projectRepository->createProject($projectData);

        if ($project) {
            $user = $this->dependencyManagerRepository->userRepository->findById($userId);
            $this->dependencyManagerRepository->projectRepository->assignMember($project, $userId);

            $projectsWithRelatedData = $this->dependencyManagerRepository->userRepository->getProjectsWithOwnerAndTasks($user);

            return $this->dependencyManagerService->responseService->successMessageDataResponse('Project created Successfully', $projectsWithRelatedData, true, 200);
        }
        return $this->dependencyManagerService->responseService->messageResponse('Project not created', false, 404);
    }

    public function stagesOfProject($projectId)
    {
        return $this->dependencyManagerRepository->projectRepository->projectData($projectId);
    }
}
