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

    public function saveLabel(Label $label, array $data )
    {
        // check later
        return $label->update($data);
    }

    public function storeLabel(array $data)
    {
        return $this->labelModel->create($data);
    }

    public function delete(Label $label)
    {
        return $label->delete();
    }
}
