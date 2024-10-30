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

    public function notFoundStatus(): JsonResponse
    {
        return response()->json([
            'status' => false,
        ], 404);
    }

    public function messageResponse(string $message,  bool $status, int $statusCode): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'status' => $status,
        ], $statusCode);
    }

    public function successDataResponse( $data, bool $status, int $statusCode): JsonResponse
    {
        return response()->json([
            'status' => $status,
            'data' => $data,
        ], $statusCode);
    }
    public function successMessageDataResponse(string $message, $data, bool $status, int $statusCode): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'data' => $data,
            'status' => $status,
        ], $statusCode);
    }
    public function successProjectTaskResponse(string $message, $project, $task, bool $status, int $statusCode): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'project' => $project,
            'task' => $task,
            'status' => $status,
        ], $statusCode);
    }
}
