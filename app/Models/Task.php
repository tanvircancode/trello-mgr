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
   
}
