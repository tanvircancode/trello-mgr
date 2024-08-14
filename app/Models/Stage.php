<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'lists';

    protected $fillable = [
        'project_id', 'title','position'
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
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'list_id');
    }
    public function tasks()
    {
        return $this->hasMany(Task::class, 'list_id');
    }

    public static function createStage(array $data , $id) {
        
        $project = Project::find($data['project_id']);

        if (!$project) {
            return false;
        }
        $stage = new static;
        $stage->fill($data);
        $stage->save();

        return $stage;
    }
}