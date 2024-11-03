<?php

namespace App\Repositories;

use App\Models\Label;

class LabelRepository
{
    protected $labelModel;

    public function __construct(Label $labelModel)
    {
        $this->labelModel = $labelModel;
    }

    public function findById($id)
    {
        return $this->labelModel->find($id);
    }

    public function createLabel(array $data)
    {
        return $this->labelModel->create($data);
    }
}
