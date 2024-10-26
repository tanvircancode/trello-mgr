<?php

namespace App\Services;

use App\Repositories\UserRepository;
use App\Services\DependencyManagerService;
use App\Repositories\DependencyManagerRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;

class UserService
{
    protected DependencyManagerRepository $dependencyManagerRepository;
    protected DependencyManagerService $dependencyManagerService;

    public function __construct(DependencyManagerRepository $dependencyManagerRepository, DependencyManagerService $dependencyManagerService)
    {
        $this->dependencyManagerRepository = $dependencyManagerRepository;
        $this->dependencyManagerService = $dependencyManagerService;
    }

    public function registerUser(array $userData)
    {
        if ($this->dependencyManagerRepository->userRepository->isEmailUnique($userData['email'])) {

            $userData['password'] = bcrypt($userData['password']);

            if (empty($userData['token']) || $userData['token'] != env('REGISTER_TOKEN')) {
                return $this->dependencyManagerService->responseService->unauthorizedResponse();
            }

            $user = $this->dependencyManagerRepository->userRepository->createUser($userData);

            // Additional business logic, if needed
            return $user;
        }

        // Handle duplicate email scenario
        return $this->dependencyManagerService->responseService->messageResponse('Email is already registered', false, 404);
    }

    public function userLogin(array $userData)
    {
        $credentials = [
            'email' => $userData['email'],
            'password' => $userData['password']
        ];

        if (Auth::attempt($credentials)) {
            $user = $this->dependencyManagerRepository->userRepository->getAuthenticatedUser();
            $token = $user->createToken('MyAppToken')->plainTextToken;

            $responseData = [
                'user' => $user,
                'token' => $token,
            ];
            return $this->dependencyManagerService->responseService->successDataResponse($responseData, true, 200);
        }
        return $this->dependencyManagerService->responseService->messageResponse('Invalid Credentials', false, 404);
    }

    public function logout(Model $user)
    {
        if ($this->dependencyManagerRepository->userRepository->deleteCurrentAccessToken($user)) {
            return $this->dependencyManagerService->responseService->messageResponse('Logged out successfully', true, 200);
        }
        return $this->dependencyManagerService->responseService->notFoundStatus();
    }

    public function getUserDetails()
    {
        $user = $this->dependencyManagerRepository->userRepository->getAuthenticatedUser();

        if (!$user) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        return $this->dependencyManagerService->responseService->successDataResponse($user, true, 200);
    }

    public function showUserProjects($id)
    {
        if (!$this->dependencyManagerService->authService->isAuthenticated($id)) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $projectsOfUser = $this->dependencyManagerRepository->userRepository->getProjectsWithOwnerAndTasks($id);
        if (!$projectsOfUser) {
            return $this->dependencyManagerService->responseService->messageResponse('User not found', false, 404);
        }

        foreach ($projectsOfUser as $project) {
            $project->is_owner = $project->user_id === $id;
        }

        return $this->dependencyManagerService->responseService->successDataResponse($projectsOfUser, true, 200);
    }

    public function searchUsers(array $searchData)
    {
        $searchTerm =  $searchData['searchTerm'];
        $projectId  =  $searchData['project_id'];

        $project = $this->dependencyManagerRepository->projectRepository->findById($projectId);

        if (!$project) {
            return $this->dependencyManagerService->responseService->messageResponse('Project not found', false, 404);
        }

        if ($project->user_id !== Auth::user()->id) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $users = $this->dependencyManagerRepository->userRepository->searchBetweenUsers($searchTerm);

        $users = $users->map(function ($user) use ($projectId) {
            $user->isMember = $this->dependencyManagerRepository->userRepository->isMemberOfProject($user->id, $projectId);
            return $user;
        });

        return $this->dependencyManagerService->responseService->successDataResponse($users, true, 200);
    }

    public function addMember(array $projectData)
    {
        $projectId = $projectData['project_id'];
        $userId = $projectData['user_id'];
        $ownerId = $projectData['owner_id'];

        if ($ownerId !== Auth::user()->id) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $user = $this->dependencyManagerRepository->userRepository->findById($userId);
        if (!$user) {
            return $this->dependencyManagerService->responseService->messageResponse('User not found', false, 404);
        }

        if (!$this->dependencyManagerRepository->projectRepository->isUserAlreadyMember($projectId, $user->id)) {
            return $this->dependencyManagerService->responseService->messageResponse('User is already a member of this project', false, 404);
        }

        $project = $this->dependencyManagerRepository->projectRepository->fetchDetailstWithProjectId($projectId);
        return $this->dependencyManagerService->responseService->successMessageDataResponse('Member Added Successfully', $project, true, 200);
    }

    public function removeMemberFromProject($projectId, $userId)
    {
        $project = $this->dependencyManagerRepository->projectRepository->findById($projectId);
        if (!$project) {
            return $this->dependencyManagerService->responseService->messageResponse('Project not found', false, 404);
        }

        if ($project->user_id !== Auth::user()->id) {
            return $this->dependencyManagerService->responseService->unauthorizedResponse();
        }

        $user = $this->dependencyManagerRepository->userRepository->findById($userId);
        if (!$user) {
            return $this->dependencyManagerService->responseService->messageResponse('User not found', false, 404);
        }

       
        $this->dependencyManagerRepository->projectRepository->detachUser($projectId,$userId);
        $this->dependencyManagerRepository->projectRepository->stagesOfProject($projectId,$userId);

        $projectData = $this->dependencyManagerRepository->projectRepository->fetchDetailstWithProjectId($projectId);
        return $this->dependencyManagerService->responseService->successMessageDataResponse('Member Removed Successfully', $projectData, true, 200);
    
    }
}
