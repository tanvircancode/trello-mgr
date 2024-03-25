<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $keyType = 'string';

    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'password_hint'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = Str::uuid();
        });
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */

    protected $casts = [
        'name' => 'string',
        'email' => 'string',
        'password' => 'string',
        'password_hint' => 'string',
    ];


    public function project()
    {
        return $this->hasMany(Project::class);
    }

    //A User can be a member of many Projects through the project_members table
    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_members', 'user_id', 'project_id');
    }

    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'task_users');
    }

    // must ** 
    public function isMemberOfProject($projectId)
    {
        return $this->projects()->where('project_id', $projectId)->exists();
    }


    //custom methods

    public function getProjectsWithOwnerAndTasks()
    {
        $projects = $this->projects()
            ->with(['members', 'user', 'tasks', 'tasks.users', 'tasks.labels', 'tasks.priorities', 'tasks.checklists', 'tasks.checklists.checklistitems'])
            ->get();

            foreach($projects as $project) {
                $project->is_owner = $project->user_id === $this->id;
            }
            return $projects;
    }


    //must
    public function addToProject($projectId)
    {
        $project = Project::find($projectId);

        if ($project->members()->where('user_id', $this->id)->exists()) {
            return false;
        }

        $memberId = Str::uuid();
        $project->members()->attach($this->id, ['id' => $memberId]);

        return true;
    }
}
