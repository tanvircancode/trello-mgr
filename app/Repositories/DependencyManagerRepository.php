<?php

namespace App\Repositories;

use App\Repositories\UserRepository;
use App\Repositories\ProjectRepository;
use App\Repositories\StageRepository;

class DependencyManagerRepository
{
    public UserRepository $userRepository;
    public ProjectRepository $projectRepository;
    public StageRepository $stageRepository;

    public function __construct(
        UserRepository $userRepository,
        ProjectRepository $projectRepository,
        StageRepository $stageRepository,
    ) {
        $this->userRepository = $userRepository;
        $this->projectRepository = $projectRepository;
        $this->stageRepository = $stageRepository;
    }
}
