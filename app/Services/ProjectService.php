<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class ProjectService
{
    public function getAll($data)
    {
        $stages = Project::with([
            'members',
            'stages' => function ($query) {
                $query->orderBy('position', 'asc');
            },
            'stages.tasks' => function ($query) {
                $query->orderBy('created_at', 'asc');
            },
            // 'stages.tasks.users',
            'stages.tasks.labels',
            'stages.tasks.priorities',
            'stages.tasks.checklists',
            'stages.tasks.checklists.checklistitems'
        ])->find($data['project_id']);

        return $stages;
    }
}
