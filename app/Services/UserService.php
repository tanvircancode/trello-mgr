<?php

namespace App\Services;

use App\Repositories\UserRepository;
use App\Services\DependencyManagerService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;

class UserService
{
    protected UserRepository $userRepository;
    protected DependencyManagerService $dependencyManager;

    public function __construct(UserRepository $userRepository, DependencyManagerService $dependencyManager)
    {
        $this->userRepository = $userRepository;
        $this->dependencyManager = $dependencyManager;
    }

    public function registerUser(array $userData)
    {
        if ($this->userRepository->isEmailUnique($userData['email'])) {

            $userData['password'] = bcrypt($userData['password']);

            if (empty($userData['token']) || $userData['token'] != env('REGISTER_TOKEN')) {
                return $this->dependencyManager->responseService->unauthorizedResponse();
            }

            $user = $this->userRepository->createUser($userData);

            // Additional business logic, if needed
            return $user;
        }

        // Handle duplicate email scenario
        return $this->dependencyManager->responseService->messageResponse('Email is already registered', false, 404);
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
            return $this->dependencyManager->responseService->successDataResponse( $responseData, true, 200 );
        }
        return $this->dependencyManager->responseService->messageResponse('Invalid Credentials', false, 404);
    }

    public function logout(Model $user)
    {
        if ($this->userRepository->deleteCurrentAccessToken($user)) {
            return $this->dependencyManager->responseService->messageResponse('Logged out successfully', true, 200);
        }
        return $this->dependencyManager->responseService->notFoundStatus();
    }

    public function getUserDetails()
    {
        $user = $this->userRepository->getAuthenticatedUser();

        if (!$user) {
            return $this->dependencyManager->responseService->unauthorizedResponse();
        }

        return $this->dependencyManager->responseService->successDataResponse($user, true, 200);
    }

    public function showUserProjects($id) {

        if (!$this->dependencyManager->authService->isAuthenticated($id)) {
            return $this->dependencyManager->responseService->unauthorizedResponse();
        }

        $user = $this->userRepository->findById($id);

        if (!$user) {
            return $this->dependencyManager->responseService->messageResponse('User not found', false, 404);
        }

        $projects = $this->userRepository->getProjectsWithOwnerAndTasks();
        foreach ($projects as $project) {
            $project->is_owner = $project->user_id === $user->id;
        }
        
        return $this->dependencyManager->responseService->successDataResponse($projects, true, 200);

    }
}
