<?php

namespace App\Repositories;

use App\Models\Stage;

class StageRepository
{
    protected $stageModel;

    public function __construct(Stage $stageModel)
    {
        $this->stageModel = $stageModel;
    }

    public function findById($id)
    {
        return $this->stageModel->find($id);
    }

    public function createStage(array $data)
    {
        return $this->stageModel->create($data);
    }

    public function fetchStagesOfAProject($projectId)
    {
        $stages = $this->stageModel->where('project_id', $projectId)
            ->orderBy('position', 'asc')
            ->get();

        return $stages;
    }

    public function changeStagePosition(array $data)
    {
        $projectId = $data['project_id'];
        $stageId = $data['stage_id'];
        $newPosition = $data['new_position'];
        $originalPosition = $data['original_position'];

        $stage = $this->findById($stageId);

        if (!$stage) {
            return false;
        }

        $stages = $this->fetchStagesOfAProject($projectId);

        $stage->position = $newPosition;
        $stage->save();

        if ($originalPosition < $newPosition) {
            foreach ($stages as $stage) {
                if ($stage->position > $originalPosition && $stage->position <= $newPosition) {
                    $stage->position -= 1;
                    $stage->save();
                }
            }
        } else if ($originalPosition > $newPosition) {
            foreach ($stages as $stage) {
                if ($stage->position < $originalPosition && $stage->position >= $newPosition) {
                    $stage->position += 1;
                    $stage->save();
                }
            }
        }
        return true;
    }

    public function stagesOfATask(Stage $stage)
    {
        return $stage->tasks()->get();
    }

    public function updatePosition($data)
    {
        foreach ($data as $index => $stage) {
            $this->stageModel
                ->where('id', $stage['id'])
                ->update(['position' => $index + 1]);
        }

        return true;
    }
}
