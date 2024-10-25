<?php

namespace App\Repositories;

use App\Models\Project;
use Illuminate\Support\Str;


class ProjectRepository
{
    protected $projectModel;

    public function __construct(Project $projectModel)
    {
        $this->projectModel = $projectModel;
    }

    public function findById($id)
    {
        return $this->projectModel->find($id);
    }

    public function isUserAlreadyMember($projectId, $userId)
    {
        $project = $this->findById($projectId);

        if ($project->members()->where('user_id', $userId)->exists()) {
            return false;
        }

        $memberId = Str::uuid();
        $project->members()->attach($userId, ['id' => $memberId]);
    
        return true;
    }

    public function fetchDetailstWithProjectId($id)
    {
        return $this->projectModel->with('members', 'stages', 'stages.tasks', 'stages.tasks.users', 'stages.tasks.labels', 'stages.tasks.priorities', 'stages.tasks.checklists', 'stages.tasks.checklists.checklistitems')
            ->find($id);
    }

    public function detachUser($id)
    {
        return $this->projectModel->members()->detach($id);
    }
}
