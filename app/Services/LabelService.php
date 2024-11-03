<?php

namespace App\Services;

use App\Services\DependencyManagerService;
use App\Repositories\DependencyManagerRepository;
use Illuminate\Support\Str;
use App\Models\Label;

class LabelService
{
    protected DependencyManagerService $dependencyManagerService;
    protected DependencyManagerRepository $dependencyManagerRepository;

    public function __construct(DependencyManagerService $dependencyManagerService, DependencyManagerRepository $dependencyManagerRepository)
    {
        $this->dependencyManagerService = $dependencyManagerService;
        $this->dependencyManagerRepository = $dependencyManagerRepository;
    }

    public function createLabel(array $labelData)  
    {
        return $this->dependencyManagerRepository->labelRepository->createLabel($labelData);
    }

    // public function fetchUsersForLabel($id) {
    //     return $this->dependencyManagerRepository->newLabel($id);
    // }
}
