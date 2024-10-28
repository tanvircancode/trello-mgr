<?php

namespace App\Repositories;

use App\Repositories\UserRepository;
use App\Repositories\ProjectRepository;
use App\Repositories\StageRepository;
use App\Repositories\TaskRepository;

class DependencyManagerRepository
{
    public UserRepository $userRepository;
    public ProjectRepository $projectRepository;
    public StageRepository $stageRepository;
    public TaskRepository $taskRepository;

    public function __construct(
        UserRepository $userRepository,
        ProjectRepository $projectRepository,
        StageRepository $stageRepository,
        TaskRepository $taskRepository,
    ) {
        $this->userRepository = $userRepository;
        $this->projectRepository = $projectRepository;
        $this->stageRepository = $stageRepository;
        $this->taskRepository = $taskRepository;
    }
}
