<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'projects';


    protected $fillable = [
        'user_id', 'title'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = Str::uuid();
        });
    }

    protected $casts = [
        'user_id' => 'string',
        'title' => 'string',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function members()
    {
        return $this->belongsToMany(User::class, 'project_members', 'project_id', 'user_id');
    }
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    //new
    public function getMembers()
    {
        $members = $this->members()->get();

        for ($i = 0; $i < count($members); $i++) {
            $members[$i]->isMember = true;
        }

        return $members;
    }
}
