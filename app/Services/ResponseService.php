<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;

class ResponseService
{
    public function unauthorizedResponse(): JsonResponse
    {
        return response()->json([
            'status' => false,
            'message' => 'Unauthorized access'
        ], 403);
    }

    public function notFoundResponse(string $message): JsonResponse
    {
        return response()->json([
            'status' => false,
            'message' => $message
        ], 404);
    }
    public function successResponse(string $message, $data): JsonResponse
    {
        return response()->json([
            'status' => true,
            'data' => $data,
            'message' => $message,
        ], 200);
    }
}
