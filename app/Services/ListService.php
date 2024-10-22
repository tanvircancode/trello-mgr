<?php

namespace App\Services;

use App\Models\Stage;
use App\Models\Project;


class ListService
{
  public function store($data)
  {
    $project_id = $data['project_id'];
    $maxPosition = Stage::where('project_id', $project_id)->count();

    $newPosition = $maxPosition ? $maxPosition + 1 : 1;

    $data['position'] = $newPosition;

    $project = Project::find($data['project_id']);

    if (!$project) {
        return false;
    }
    Stage::create($data);
    return true;
  }
}
