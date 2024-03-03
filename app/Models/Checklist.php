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

    public function task() {
        return $this->belongsTo(Task::class);
    }

    public function checklist_items() {
        return $this->hasMany(ChecklistItem::class);
    }

}
