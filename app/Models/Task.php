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

    public function project() {
        return $this->belongsTo(Project::class);
    }

    public function checklists() {
        return $this->hasMany(Checklist::class);
    }

    public function priorities() {
        return $this->hasMany(Priority::class);
    }
    
    // for active priority
    public function activePriority()
    {
        return $this->hasOne(Priority::class)->where('is_active', true);
    }

    public function labels()
    {
        return $this->belongsToMany(Label::class);
    }

    //custom methods
    public static function createTask(array $data)
    {
        $project = Project::find($data['project_id']);

        if (!$project) {
            return false;
        }

        $task = new static;
        $task->fill($data);
        $task->save();

        // Create priorities for the task
        $prioritiesData = [
            ['name' => 'High', 'color' => '#FF0000','task_id'=>$task->id],
            ['name' => 'Medium', 'color' => '#00FF00','task_id'=>$task->id],
            ['name' => 'Low', 'color' => '#0000FF' , 'task_id'=>$task->id],
        ];

        foreach ($prioritiesData as $priorityData) {
            $priority = new Priority($priorityData);
            $task->priorities()->save($priority);
        }

        return $task;
    }
   
}
