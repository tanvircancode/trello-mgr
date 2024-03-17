<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Checklist extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'checklists';


    protected $fillable = [
        'task_id', 'name'
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

    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function checklistitems()
    {
        return $this->hasMany(ChecklistItem::class);
    }

    //custom methods
    public static function createChecklist(array $data)
    {
        $task = Task::find($data['task_id']);

        if (!$task) {
            return null;
        }

        $checklist = new static;
        $checklist->fill($data);
        $checklist->save();

        return $checklist;
    }

    public static function updateChecklist(array $data)
    {

        $checklist = Checklist::find($data['id']);
        if (!$checklist) {
            return null;
        }

        if (isset($data['name'])) {
            $checklist->name = $data['name'];
        }

        $checklist->save();

        return $checklist;
    }
}
