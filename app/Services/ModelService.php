<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;


class ModelService
{
    public function createModelInstance(string $modelClass)
    {
        if (!class_exists($modelClass)) {
            return false;
        }

        return new $modelClass();
    }
}
