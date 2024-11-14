<?php

namespace App\Services;


use App\Repositories\LabelRepository;
use App\Repositories\TaskRepository;


class LabelService
{
    protected $taskRepository;
    protected $labelRepository;

    public function __construct(
        TaskRepository $taskRepository,
        LabelRepository $labelRepository,
    ) {
        $this->taskRepository = $taskRepository;
        $this->labelRepository = $labelRepository;
    }

    public function findLabelById($id)
    {
        return $this->labelRepository->findById($id);
    }

    public function createLabel(array $labelData)
    {
        return $this->labelRepository->storeLabel($labelData);
    }

    public function updateLabel($label, array $data)
    {
        return $this->labelRepository->saveLabel($label, $data);
    }
    public function deleteLabel($label)
    {
        return $this->labelRepository->delete($label);
    }

    public function fetchLabelsOfATask($taskId)
    {
        $task = $this->taskRepository->findById($taskId);
        $task->labels();
        return $task;
    }
}
