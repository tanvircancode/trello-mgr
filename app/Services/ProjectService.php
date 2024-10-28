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

    public function storeProject(array $projectData)
    {
        $userId = $projectData['user_id'];

        if (!$this->dependencyManagerService->authService->isAuthenticated($userId)) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $project = $this->dependencyManagerRepository->projectRepository->createProject($projectData);

        if ($project) {
            $user = $this->dependencyManagerRepository->userRepository->findById($userId);
            $this->dependencyManagerRepository->projectRepository->assignMember($project, $userId);

            $projectsWithRelatedData = $this->dependencyManagerRepository->userRepository->getProjectsWithOwnerAndTasks($user);

            foreach ($projectsWithRelatedData as $project) {
                $project->is_owner = $project->user_id === $userId;
            }

            return $this->dependencyManagerService->responseService->successMessageDataResponse('Project created Successfully', $projectsWithRelatedData, true, 200);
        }
        return $this->dependencyManagerService->responseService->messageResponse('Project not created', false, 404);
    }

    public function showMembersOfAProject($projectId)
    {
        $project = $this->dependencyManagerRepository->projectRepository->findById($projectId);
        if (!$project) {
            return $this->dependencyManagerService->responseService->messageResponse('Project not found', false, 404);
        }

        if (!$this->dependencyManagerService->authService->isAuthenticated($project->user_id)) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $membersData = $this->dependencyManagerRepository->projectRepository->getMembersOfProject($project);
        for ($i = 0; $i < count($membersData); $i++) {
            $membersData[$i]->isMember = true;
        }

        return $this->dependencyManagerService->responseService->successMessageDataResponse('Member fetched Successfully', $membersData, true, 200);
    }

    public function destroyProject($projectId)
    {
        $project = $this->dependencyManagerRepository->projectRepository->findById($projectId);

        if (!$project) {
            return $this->dependencyManagerService->responseService->messageResponse('Project not found', false, 404);
        }
        $userId = $project->user_id;

        if (!$this->dependencyManagerService->authService->isAuthenticated($userId)) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $stagesUnderProject = $this->dependencyManagerRepository->projectRepository->stagesOfAProject($project);

        foreach ($stagesUnderProject as $stage) {
            $tasksUnderStage = $this->dependencyManagerRepository->stageRepository->stagesOfATask($stage);
            foreach ($tasksUnderStage as $task) {
                $this->dependencyManagerRepository->taskRepository->deleteUsersOfATask($task);
            }
        }

        $this->dependencyManagerRepository->projectRepository->deletionOfAProject($project);
        
        $user = $this->dependencyManagerRepository->userRepository->findById($userId);

        $projectsWithRelatedData = $this->dependencyManagerRepository->userRepository->getProjectsWithOwnerAndTasks($user);

        foreach ($projectsWithRelatedData as $project) {
            $project->is_owner = $project->user_id === $userId;
        }

        return $this->dependencyManagerService->responseService->successMessageDataResponse("Project Deleted Successfully", $projectsWithRelatedData, true, 200);
    }

    public function leaveProject($projectId, $userId)
    {
        $project = $this->dependencyManagerRepository->projectRepository->findById($projectId);

        if (!$project) {
            return $this->dependencyManagerService->responseService->messageResponse('Project not found', false, 404);
        }

        if (!$this->dependencyManagerService->authService->isAuthenticated($userId)) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $stagesUnderProject = $this->dependencyManagerRepository->projectRepository->stagesOfAProject($project);
        
        foreach ($stagesUnderProject as $stage) {
            $tasksUnderStage = $this->dependencyManagerRepository->stageRepository->stagesOfATask($stage);
            foreach ($tasksUnderStage as $task) {
                if($this->dependencyManagerRepository->taskRepository->checkUserOfTask($task, $userId)) {
                    $this->dependencyManagerRepository->taskRepository->deleteUserOfATask($userId);
                }
            }
        }

        $this->dependencyManagerRepository->projectRepository->detachUser($project, $userId);
        
        $user = $this->dependencyManagerRepository->userRepository->findById($userId);

        $projectsWithRelatedData = $this->dependencyManagerRepository->userRepository->getProjectsWithOwnerAndTasks($user);

        foreach ($projectsWithRelatedData as $project) {
            $project->is_owner = $project->user_id === $userId;
        }

        return $this->dependencyManagerService->responseService->successMessageDataResponse("Left Project Successfully", $projectsWithRelatedData, true, 200);
    }

    public function stagesOfProject($projectId)
    {
        return $this->dependencyManagerRepository->projectRepository->projectData($projectId);
    }
}
