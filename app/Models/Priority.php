<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Priority extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'priorities';


    protected $fillable = [
        'task_id', 'name', 'color', 'is_active'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = Str::uuid();
        });
    }

    protected $casts = [
        'task_id' => 'string',
        'name' => 'string',
        'color' => 'string',
        'is_active' => 'boolean',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }


    //custom methods
    public static function createPriority(array $data)
    {
        $task = Task::find($data['task_id']);

        if (!$task) {
            return null;
        }


        $priority = new static;
        $priority->fill($data);
        $priority->save();

        return $priority;
    }

    public static function updatePriority(array $data)
    {

        $priority = Priority::find($data['id']);
        if (!$priority) {
            return null;
        }

        if (isset($data['name'])) {
            $priority->name = $data['name'];
        }

        if (isset($data['color'])) {
            $priority->color = $data['color'];
        }


        $priority->save();

        return $priority;
    }

    public static function changePriority(array $data)
    {
        $task_id = $data['task_id'];
        $priority = Priority::find($data['id']);
        if (!$priority) {
            return null;
        }

        $selectedPriorityId = $data['id'];

        $priorities = Task::find($task_id)->priorities;

        foreach ($priorities as $priority) {
            $priority->is_active = $priority->id === $selectedPriorityId;
            $priority->save();
        }

        return true;
    }
}
