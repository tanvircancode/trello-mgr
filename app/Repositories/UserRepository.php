<?php

namespace App\Repositories;

use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class UserRepository
{
    protected $userModel;

    public function __construct(User $userModel)
    {
        $this->userModel = $userModel;
    }

    public function findById($id)
    {
        return $this->userModel->find($id);
    }

    public function isEmailUnique($email)
    {
        return $this->userModel->where('email', $email)->doesntExist();
    }

    public function createUser(array $userData)
    {
        return $this->userModel->create($userData);
    }

    public function getAuthenticatedUser()
    {
        return Auth::user();
    }

    public function deleteCurrentAccessToken(Model $user)
    {
        return $user->currentAccessToken()->delete();
    }

    public function getProjectsWithOwnerAndTasks()
    {
        return $this->userModel->projects()
            ->with([
                'members',
                'user',
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
            ])
            ->get();
    }

    public function searchBetweenUsers(string $searchTerm)
    {
        return $this->userModel->where('name', 'like', "%{$searchTerm}%")
            ->orWhere('email', 'like', "%{$searchTerm}%")
            ->get();
    }

    public function isMemberOfProject($userId, $projectId)
    {
        // check later 
        $user = $this->findById($userId);

        return $user->projects()->where('project_id', $projectId)->exists();
    }
}
