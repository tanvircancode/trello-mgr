<?php

namespace App\Services;

use App\Services\ListService;
use App\Services\ProjectService;
use App\Services\AuthService;
use App\Services\ResponseService;
use App\Services\UserService;
use App\Services\TaskService;
use App\Services\LabelService;
use App\Services\PriorityService;
use App\Services\ChecklistService;
use App\Services\ChecklistItemService;

class DependencyManagerService
{
    public ListService $listService;
    public ProjectService $projectService;
    public AuthService $authService;
    public ResponseService $responseService;
    public TaskService $taskService;
    public UserService $userService;
    public LabelService $labelService;
    public PriorityService $priorityService;
    public ChecklistService $checklistService;
    public ChecklistItemService $checklistItemService;

    public function __construct(
        ListService $listService,
        ProjectService $projectService,
        AuthService $authService,
        ResponseService $responseService,
        TaskService $taskService,
        UserService $userService,
        LabelService $labelService,
        PriorityService $priorityService,
        ChecklistService $checklistService,
        ChecklistItemService $checklistItemService,
    ) {
        $this->listService = $listService;
        $this->projectService = $projectService;
        $this->authService = $authService;
        $this->responseService = $responseService;
        $this->userService = $userService;
        $this->taskService = $taskService;
        $this->labelService = $labelService;
        $this->priorityService = $priorityService;
        $this->checklistService = $checklistService;
        $this->checklistItemService = $checklistItemService;
    }
}
