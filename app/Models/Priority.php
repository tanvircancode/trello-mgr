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
        'task_id', 'name', 'color','is_active'
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

    public function task() {
        return $this->belongsTo(Task::class);
    }

   
}
