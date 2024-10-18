<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;

class ResponseService
{
    public function unauthorizedResponse(): JsonResponse
    {
        return response()->json([
            'status' => false, 'message' => 'Unauthorized access'
        ], 403);
    }
}
