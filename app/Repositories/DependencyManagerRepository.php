<?php

namespace App\Repositories;

use App\Repositories\UserRepository;
use App\Repositories\ProjectRepository;
use App\Repositories\StageRepository;
use App\Repositories\TaskRepository;
use App\Repositories\LabelRepository;
use App\Repositories\PriorityRepository;
use App\Repositories\ChecklistRepository;

class DependencyManagerRepository
{
    public UserRepository $userRepository;
    public ProjectRepository $projectRepository;
    public StageRepository $stageRepository;
    public TaskRepository $taskRepository;
    public LabelRepository $labelRepository;
    public PriorityRepository $priorityRepository;
    public ChecklistRepository $checklistRepository;

    public function __construct(
        UserRepository $userRepository,
        ProjectRepository $projectRepository,
        StageRepository $stageRepository,
        TaskRepository $taskRepository,
        LabelRepository $labelRepository,
        PriorityRepository $priorityRepository,
        ChecklistRepository $checklistRepository,
    ) {
        $this->userRepository = $userRepository;
        $this->projectRepository = $projectRepository;
        $this->stageRepository = $stageRepository;
        $this->taskRepository = $taskRepository;
        $this->labelRepository = $labelRepository;
        $this->priorityRepository = $priorityRepository;
        $this->checklistRepository = $checklistRepository;
    }
}
