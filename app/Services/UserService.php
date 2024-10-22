<?php
namespace App\Services;

use App\Repositories\UserRepository;
use App\Services\DependencyManagerService;

class UserService
{
    protected UserRepository $userRepository;
    protected DependencyManagerService $dependencyManager;

    public function __construct(UserRepository $userRepository , DependencyManagerService $dependencyManager)
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
        return $this->dependencyManager->responseService->notFoundResponse('Email is already registered');
    }
}