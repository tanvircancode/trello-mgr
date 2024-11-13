<?php

namespace App\Services;

use App\Services\ResponseService;
use App\Repositories\UserRepository;
use App\Repositories\ProjectRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;

class UserService
{
    protected $userRepository;
    protected $projectRepository;
    protected $responseService;
    protected $authService;

    public function __construct(UserRepository $userRepository, ProjectRepository $projectRepository, AuthService $authService, ResponseService $responseService)
    {
        $this->userRepository = $userRepository;
        $this->projectRepository = $projectRepository;
        $this->responseService = $responseService;
        $this->authService = $authService;
    }

    public function findUserById($id)
    {
        return $this->userRepository->findById($id);
    }

    public function getProjectsFromUser($user)
    {
        return $this->userRepository->getProjectsWithOwnerAndTasks($user);
    }

    public function registerUser(array $userData)
    {
        if ($this->userRepository->isEmailUnique($userData['email'])) {

            $userData['password'] = bcrypt($userData['password']);

            if (empty($userData['token']) || $userData['token'] != env('REGISTER_TOKEN')) {
                return $this->responseService->unauthorizedResponse();
            }

            $user = $this->userRepository->createUser($userData);

            return $user;
        }

        // Handle duplicate email scenario
        return $this->responseService->messageResponse('Email is already registered', false, 404);
    }

    public function userLogin(array $userData)
    {

        $credentials = [
            'email' => $userData['email'],
            'password' => $userData['password']
        ];

        if (Auth::attempt($credentials)) {
            $user = $this->userRepository->getAuthenticatedUser();
            $token = $user->createToken('MyAppToken')->plainTextToken;

            $responseData = [
                'user' => $user,
                'token' => $token,
            ];
            return $this->responseService->successDataResponse($responseData, true, 200);
        }
        return $this->responseService->messageResponse('Invalid Credentials', false, 404);
    }

    public function logout(Model $user)
    {
        if ($this->userRepository->deleteCurrentAccessToken($user)) {
            return $this->responseService->messageResponse('Logged out successfully', true, 200);
        }
        return $this->responseService->notFoundStatus();
    }

    public function getUserDetails()
    {
        $user = $this->userRepository->getAuthenticatedUser();

        if (!$user) {
            return $this->responseService->unauthorizedResponse();
        }

        return $this->responseService->successDataResponse($user, true, 200);
    }

    public function showUserProjects($id)
    {
        if (!$this->authService->isAuthenticated($id)) {
            return $this->responseService->unauthorizedResponse();
        }

        $user = $this->findUserById($id);
        $projectsOfUser = $this->getProjectsFromUser($user);

        // if (!$projectsOfUser) {
        //     return $this->responseService->messageResponse('User not found', false, 404);
        // }

        foreach ($projectsOfUser as $project) {
            $project->is_owner = $project->user_id === $id;
        }

        return $this->responseService->successDataResponse($projectsOfUser, true, 200);
    }

    public function searchUsers(array $searchData)
    {
        $searchTerm =  $searchData['searchTerm'];
        $projectId  =  $searchData['project_id'];

        $project = $this->projectRepository->findById($projectId);

        if (!$project) {
            return $this->responseService->messageResponse('Project not found', false, 404);
        }

        if ($project->user_id !== Auth::user()->id) {
            return $this->responseService->unauthorizedResponse();
        }

        $users = $this->userRepository->searchBetweenUsers($searchTerm);

        $users = $users->map(function ($user) use ($projectId) {
            $user->isMember = $this->userRepository->isMemberOfProject($user->id, $projectId);
            return $user;
        });

        return $this->responseService->successDataResponse($users, true, 200);
    }

    public function addMember(array $projectData)
    {
        $projectId = $projectData['project_id'];
        $userId = $projectData['user_id'];
        $ownerId = $projectData['owner_id'];

        if ($ownerId !== Auth::user()->id) {
            return $this->responseService->unauthorizedResponse();
        }

        $user = $this->findUserById($userId);
        if (!$user) {
            return $this->responseService->messageResponse('User not found', false, 404);
        }

        if (!$this->projectRepository->isUserAlreadyMember($projectId, $user->id)) {
            return $this->responseService->messageResponse('User is already a member of this project', false, 404);
        }

        $project = $this->projectRepository->projectDetails($projectId);
        return $this->responseService->successMessageDataResponse('Member Added Successfully', $project, true, 200);
    }

    public function removeMemberFromProject($projectId, $userId)
    {
        $project = $this->projectRepository->findById($projectId);
        if (!$project) {
            return $this->responseService->messageResponse('Project not found', false, 404);
        }

        if ($project->user_id !== Auth::user()->id) {
            return $this->responseService->unauthorizedResponse();
        }

        $user = $this->findUserById($userId);
        if (!$user) {
            return $this->responseService->messageResponse('User not found', false, 404);
        }


        $this->projectRepository->detachUser($project, $userId);
        $this->projectRepository->stagesOfProject($projectId, $userId);

        $projectData = $this->projectRepository->projectDetails($projectId);
        return $this->responseService->successMessageDataResponse('Member Removed Successfully', $projectData, true, 200);
    }
}
