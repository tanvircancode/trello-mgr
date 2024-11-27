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

    // new code starts
    public function createProject(array $projectData)
    {
        return $this->projectModel->create($projectData);
    }

    public function assignMember(Project $project, $userId)
    {
        return $project->members()->attach($userId, ['id' => Str::uuid()]);
    }

    public function getMembersOfProject(Project $project)
    {
        $members = $project->members()->get();

        return $members;
    }

    public function stagesOfAProject(Project $project)
    {
        return $project->stages()->get();
    }

    public function deletionOfAProject(Project $project)
    {
        $project->stages()->delete();

        $project->members()->detach();

        $project->delete();

        return true;
    }

    // new code end
    public function projectData($projectId)
    {
        $stages = $this->projectModel->with([
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
        ])->find($projectId);

        return $stages;
    }

    public function getTasksByListId($listId)
    {
        $tasks = $this->projectModel->with([
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
        ])->whereHas('stages', function ($query) use ($listId) {
            $query->where('id', $listId);
        })->first();

        return $tasks;
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

    public function projectDetails($id)
    {
        return $this->projectModel->with('members', 'stages', 'stages.tasks', 'stages.tasks.users', 'stages.tasks.labels', 'stages.tasks.priorities', 'stages.tasks.checklists', 'stages.tasks.checklists.checklistitems')
            ->find($id);
    }

    public function detachUser($project, $userId)
    {
        return $project->members()->detach($userId);
    }

    public function stagesOfProject($projectId, $userId)
    {
        $project = $this->findById($projectId);
        $stagesUnderProject = $project->stages()->get();

        foreach ($stagesUnderProject as $stage) {
            $tasksUnderStage = $stage->tasks()->get();
            foreach ($tasksUnderStage as $task) {
                if ($task->users->contains($userId)) {
                    $task->users()->detach($userId);
                }
            }
        }
        return true;
    }
}
