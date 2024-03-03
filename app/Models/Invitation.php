<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;


class Invitation extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'invitations';


    protected $fillable = [
        'project_id', 'project_title', 'invited_user_id', 'token', 'status', 'expires_at'
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
        'project_title' => 'string',
        'invited_user_id' => 'string',
        'token' => 'string',
        'expires_at' => 'datetime',
    ];

    public function project() {
        return $this->belongsTo(Project::class);
    }

    public function invitedUser()
    {
        return $this->belongsTo(User::class, 'invited_user_id');
    }
}
