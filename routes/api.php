<?php

use App\Http\Controllers\ProjectsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    
  // user apis
  Route::get('/user/{id}', [UsersController::class, 'show']);
  Route::get('/me', [UsersController::class, 'me']);
  Route::get('/logout', [UsersController::class, 'logout']);

  // project apis
  Route::post('/project', [ProjectsController::class, 'store']);
  
});

Route::post('/register', [UsersController::class, 'store']);
Route::post('/login', [UsersController::class, 'login']);
