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
        'project_id',
        'title',
        'position'
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

    public static function createStage(array $data, $id)
    {

        $project = Project::find($data['project_id']);

        if (!$project) {
            return false;
        }

        $stage = new static;
        $stage->fill($data);
        $stage->save();

        return $stage;
    }

    public static function updateStage(array $data)
    {
        $projectId = $data['project_id'];
        $stageId = $data['stage_id'];
        $newPosition = $data['new_position'];
        $originalPosition = $data['original_position'];

        $stage = Stage::find($stageId);

        if (!$stage) {
            return false;
        }

        $stages = self::where('project_id', $projectId)
                  ->orderBy('position', 'asc')
                  ->get();

         // Update the stage's position
         $stage->position = $newPosition;
         $stage->save();

         if($originalPosition < $newPosition) {
            foreach($stages as $stage) {
                if($stage->position > $originalPosition && $stage->position <= $newPosition) {
                    $stage->position -= 1;
                    $stage->save();
                }
            }
         } else if($originalPosition > $newPosition) {
            foreach($stages as $stage) {
                if($stage->position < $originalPosition && $stage->position >= $newPosition) {
                    $stage->position += 1;
                    $stage->save();
                }
            }
         }
         return true;
    
    }
}
