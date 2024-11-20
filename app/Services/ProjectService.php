<?php

namespace App\Services;

use App\Services\ResponseService;
use App\Services\AuthService;
use App\Repositories\UserRepository;
use App\Repositories\TaskRepository;
use App\Repositories\StageRepository;
use App\Repositories\ProjectRepository;

class ProjectService
{
    protected $userRepository;
    protected $projectRepository;
    protected $taskRepository;
    protected $stageRepository;
    protected $responseService;
    protected $authService;

    public function __construct(
        UserRepository $userRepository,
        ProjectRepository $projectRepository,
        AuthService $authService,
        ResponseService $responseService,
        StageRepository $stageRepository,
        TaskRepository $taskRepository,
    ) {
        $this->userRepository = $userRepository;
        $this->projectRepository = $projectRepository;
        $this->responseService = $responseService;
        $this->authService = $authService;
        $this->stageRepository = $stageRepository;
        $this->taskRepository = $taskRepository;
    }

    public function findProjectById($projectId)
    {
        return $this->projectRepository->findById($projectId);
    }


    public function stagesOfProject($projectId)
    {
        return $this->projectRepository->projectData($projectId);
    }

    public function fetchDetailstWithProjectId($projectId)
    {
        return $this->projectRepository->projectDetails($projectId);
    }

    public function storeProject(array $projectData)
    {
        $userId = $projectData['user_id'];

        if (!$this->authService->isAuthenticated($userId)) {
            return $this->responseService->unauthorizedResponse();
        }

        $project = $this->projectRepository->createProject($projectData);

        if ($project) {
            $user = $this->userRepository->findById($userId);
            $this->projectRepository->assignMember($project, $userId);

            $projectsWithRelatedData = $this->userRepository->getProjectsWithOwnerAndTasks($user);

            foreach ($projectsWithRelatedData as $project) {
                $project->is_owner = $project->user_id === $userId;
            }

            return $this->responseService->successMessageDataResponse('Project created Successfully', $projectsWithRelatedData, true, 200);
        }
        return $this->responseService->messageResponse('Project not created', false, 404);
    }

    public function showMembersOfAProject($projectId)
    {
        $project = $this->projectRepository->findById($projectId);
        if (!$project) {
            return $this->responseService->messageResponse('Project not found', false, 404);
        }

        if (!$this->authService->isAuthenticated($project->user_id)) {
            return $this->responseService->unauthorizedResponse();
        }

        $membersData = $this->projectRepository->getMembersOfProject($project);
        for ($i = 0; $i < count($membersData); $i++) {
            $membersData[$i]->isMember = true;
        }

        return $this->responseService->successMessageDataResponse('Member fetched Successfully', $membersData, true, 200);
    }

    public function destroyProject($projectId)
    {
        $project = $this->projectRepository->findById($projectId);

        if (!$project) {
            return $this->responseService->messageResponse('Project not found', false, 404);
        }
        $userId = $project->user_id;

        if (!$this->authService->isAuthenticated($userId)) {
            return $this->responseService->unauthorizedResponse();
        }

        $stagesUnderProject = $this->projectRepository->stagesOfAProject($project);

        foreach ($stagesUnderProject as $stage) {
            $tasksUnderStage = $this->stageRepository->stagesOfATask($stage);
            foreach ($tasksUnderStage as $task) {
                $this->taskRepository->deleteUsersOfATask($task);
            }
        }

        $this->projectRepository->deletionOfAProject($project);

        $user = $this->userRepository->findById($userId);

        $projectsWithRelatedData = $this->userRepository->getProjectsWithOwnerAndTasks($user);

        foreach ($projectsWithRelatedData as $project) {
            $project->is_owner = $project->user_id === $userId;
        }

        return $this->responseService->successMessageDataResponse("Project Deleted Successfully", $projectsWithRelatedData, true, 200);
    }

    public function leaveProjectAsMember($projectId, $userId)
    {
        $project = $this->projectRepository->findById($projectId);

        if (!$project) {
            return $this->responseService->messageResponse('Project not found', false, 404);
        }

        if (!$this->authService->isAuthenticated($userId)) {
            return $this->responseService->unauthorizedResponse();
        }

        $stagesUnderProject = $this->projectRepository->stagesOfAProject($project);

        foreach ($stagesUnderProject as $stage) {
            $tasksUnderStage = $this->stageRepository->stagesOfATask($stage);
            foreach ($tasksUnderStage as $task) {
                if ($this->taskRepository->checkUserOfTask($task, $userId)) {
                    $this->taskRepository->deleteUserOfATask($task, $userId);
                }
            }
        }

        $this->projectRepository->detachUser($project, $userId);

        $user = $this->userRepository->findById($userId);

        $projectsWithRelatedData = $this->userRepository->getProjectsWithOwnerAndTasks($user);

        foreach ($projectsWithRelatedData as $project) {
            $project->is_owner = $project->user_id === $userId;
        }

        return $this->responseService->successMessageDataResponse("Left Project Successfully", $projectsWithRelatedData, true, 200);
    }
}
