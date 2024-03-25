<?php

use App\Http\Controllers\ChecklistItemsController;
use App\Http\Controllers\ChecklistsController;
use App\Http\Controllers\LabelsController;
use App\Http\Controllers\PrioritiesController;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\TasksController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Models\ChecklistItem;

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
  Route::get('/projects/{id}', [UsersController::class, 'show']);

  // project apis
  Route::post('/project', [ProjectsController::class, 'store']);
  Route::get('/projectmembers/{id}', [ProjectsController::class, 'showMembers']);
  Route::delete('/deleteproject/{id}', [ProjectsController::class, 'destroy']);
  Route::delete('/leaveproject/{id}/{memberId}', [ProjectsController::class, 'leaveProject']);

  // task apis
  Route::post('/task/{id}', [TasksController::class, 'store']);
  Route::put('/task', [TasksController::class, 'update']);
  Route::delete('/deletetask/{id}/{memberId}', [TasksController::class, 'destroy']);

  //label apis
  Route::post('/label', [LabelsController::class, 'store']);
  Route::put('/label/{id}', [LabelsController::class, 'update']);
  Route::delete('/deletelabel/{id}', [LabelsController::class, 'destroy']);
  Route::put('/changelabel/{id}', [LabelsController::class, 'updateSelected']);

  //priority apis
  Route::post('/priority', [PrioritiesController::class, 'store']);
  Route::put('/priority', [PrioritiesController::class, 'update']);
  Route::delete('/deletepriority/{id}', [PrioritiesController::class, 'destroy']);
  Route::put('/changepriority', [PrioritiesController::class, 'updateSelected']);

   //checklist apis
   Route::post('/checklist', [ChecklistsController::class, 'store']);
  Route::put('/checklist', [ChecklistsController::class, 'update']);
  Route::delete('/deletechecklist/{id}', [ChecklistsController::class, 'destroy']);

   //checklist item apis
   Route::post('/item', [ChecklistItemsController::class, 'store']);
   Route::put('/item', [ChecklistItemsController::class, 'update']);
   Route::delete('/deleteitem/{id}', [ChecklistItemsController::class, 'destroy']);

  //search users to show already or add member
  Route::post('/searchusers', [UsersController::class, 'searchUsers']);
  // add member from search bar
  Route::post('/addmember', [UsersController::class, 'addMember']);
  // remove member from search bar
  Route::delete('/removemember/{projectId}/{memberId}', [UsersController::class, 'removeMember']);
  // assign user to a task
  Route::post('/addtaskmember', [TasksController::class, 'assignTask']);
  Route::post('/removetaskmember', [TasksController::class, 'removeTask']);



});
// Login and Register
Route::post('/register', [UsersController::class, 'store']);
Route::post('/login', [UsersController::class, 'login']);
