<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Label extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'labels';


    protected $fillable = [
        'name', 'color', 'task_id','is_active'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = Str::uuid();
        });
    }

    protected $casts = [
        'name' => 'string',
        'color' => 'string',
        'task_id' => 'string',
        'is_active' => 'boolean'
    ];


    public function task()
    {
        return $this->belongsTo(Task::class);
    }

     //custom methods
     public static function createLabel(array $data)
     {
         $task = Task::find($data['task_id']);
         
         if (!$task) {
            return null;
        }

         if($data['name'] === null)  {
            $data['name'] = "";
         }
 
 
         $label = new static;
         $label->fill($data);
         $label->save();
 
         return $label;
     }
}
