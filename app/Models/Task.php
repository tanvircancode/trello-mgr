<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;


class Task extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'tasks';


    protected $fillable = [
        'project_id', 'title', 'description'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = Str::uuid();
        });
    }

    protected $casts = [
        'project_id' => 'string',
        'title' => 'string',
        'description' => 'string',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function checklists()
    {
        return $this->hasMany(Checklist::class);
    }

    public function priorities()
    {
        return $this->hasMany(Priority::class);
    }

    public function labels()
    {
        return $this->hasMany(Label::class);
    }

    // pivot table
    public function users()
    {
        return $this->belongsToMany(User::class, 'task_users');
    }
    
    public function assignUser(array $data)
    {
        $user_id = $data['user_id'];
        $user = User::find($user_id);
        if(!$user) {
            return null;
        }
         $this->users()->attach($user->id , ['id' => Str::uuid()]);
        return true;
    }

    public function removeUser(array $data)
    {
        $user_id = $data['user_id'];
        $user = User::find($user_id);
        if(!$user) {
            return null;
        }
        $this->users()->detach($user->id);
        return true;
    }
   


    //custom methods
    public static function createTask(array $data , $id)
    {
        $project = Project::find($data['project_id']);

        if (!$project) {
            return false;
        }

        $task = new static;
        $task->fill($data);
        $task->save();
        
        $task->users()->attach($id , ['id' => Str::uuid()]);

        // Create priorities for the task
        $prioritiesData = [
            ['name' => 'Highest', 'color' => '#f12323b3', 'task_id' => $task->id],
            ['name' => 'Medium', 'color' => '#68c757c7', 'task_id' => $task->id],
            ['name' => 'Low', 'color' => '#0079BF', 'task_id' => $task->id],
        ];

        foreach ($prioritiesData as $priorityData) {
            $priority = new Priority($priorityData);
            $task->priorities()->save($priority);
        }

        // Create labels for the task
        $labelsData = [
            ['color' => '#216E4E', 'name' => '', 'task_id' => $task->id],
            ['color' => '#7F5F01', 'name' => '', 'task_id' => $task->id],
            ['color' => '#A54800', 'name' => '', 'task_id' => $task->id],
        ];

        foreach ($labelsData as $labelData) {
            $label = new Label($labelData);
            $task->labels()->save($label);
        }

        return $task;
    }
}
