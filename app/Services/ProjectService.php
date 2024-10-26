<?php

namespace App\Services;

use App\Models\Project;
use App\Repositories\DependencyManagerRepository;

class ProjectService
{
    protected DependencyManagerRepository $dependencyManagerRepository;

    public function __construct(DependencyManagerRepository $dependencyManagerRepository)
    {
        $this->dependencyManagerRepository = $dependencyManagerRepository;
    }

    public function stagesOfProject($projectId)
    {
       return $this->dependencyManagerRepository->projectRepository->projectData($projectId);
    }
    
}
