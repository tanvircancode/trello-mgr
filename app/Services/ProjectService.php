<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class ProjectService
{
    public function getAll($id)
    {
        $stages = Project::with([
            'members',
            'stages' => function ($query) {
                $query->orderBy('position', 'asc');
            },
            'stages.tasks' => function ($query) {
                $query->orderBy('created_at', 'asc');
            },
            
            'stages.tasks.labels',
            'stages.tasks.priorities',
            'stages.tasks.checklists',
            'stages.tasks.checklists.checklistitems'
        ])->find($id);

        return $stages;
    }
}
