<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;


class ChecklistItem extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'checklist_items';


    protected $fillable = [
        'checklist_id', 'name', 'is_completed'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = Str::uuid();
        });
    }

    protected $casts = [
        'checklist_id' => 'string',
        'name' => 'string',
        'is_completed' => 'boolean',

    ];

    public function checklist()
    {
        return $this->belongsTo(Checklist::class);
    }

    //custom methods
    public static function createItem(array $data)
    {
        $checklist = Checklist::find($data['checklist_id']);

        if (!$checklist) {
            return null;
        }

        $item = new static;
        $item->fill($data);
        $item->save();

        return $item;
    }

    public static function updateItem(array $data)
    {

        $item = ChecklistItem::find($data['id']);
        if (!$item) {
            return null;
        }

        $item->fill($data);
        $item->save();

        return $item;
    }
}
