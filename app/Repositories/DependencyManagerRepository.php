<?php

namespace App\Repositories;

use App\Repositories\UserRepository;
use App\Repositories\ProjectRepository;

class DependencyManagerRepository
{
    public UserRepository $userRepository;
    public ProjectRepository $projectRepository;

    public function __construct(
        UserRepository $userRepository,
        ProjectRepository $projectRepository,
    ) {
        $this->userRepository = $userRepository;
        $this->projectRepository = $projectRepository;
    }
}
