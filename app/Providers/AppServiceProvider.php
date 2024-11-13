<?php

namespace App\Providers;

use App\Services\ListService;
use App\Services\ProjectService;
use App\Services\AuthService;
use App\Services\ResponseService;
use App\Services\UserService;
use App\Services\TaskService;
use App\Services\LabelService;
use App\Services\PriorityService;
use App\Services\ChecklistService;
use App\Services\ChecklistItemService;
use App\Repositories\UserRepository;
use App\Repositories\ProjectRepository;
use App\Repositories\StageRepository;
use App\Repositories\TaskRepository;
use App\Repositories\LabelRepository;
use App\Repositories\PriorityRepository;
use App\Repositories\ChecklistRepository;
use App\Repositories\ChecklistItemRepository;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        $this->app->singleton(ListService::class);
        $this->app->singleton(ProjectService::class);
        $this->app->singleton(AuthService::class);
        $this->app->singleton(ResponseService::class);
        $this->app->singleton(UserService::class);
        $this->app->singleton(TaskService::class);
        $this->app->singleton(LabelService::class);
        $this->app->singleton(PriorityService::class);
        $this->app->singleton(ChecklistService::class);
        $this->app->singleton(ChecklistItemService::class);
        $this->app->singleton(UserRepository::class);
        $this->app->singleton(UserRepository::class);
        $this->app->singleton(ProjectRepository::class);
        $this->app->singleton(StageRepository::class);
        $this->app->singleton(TaskRepository::class);
        $this->app->singleton(LabelRepository::class);
        $this->app->singleton(PriorityRepository::class);
        $this->app->singleton(ChecklistRepository::class);
        $this->app->singleton(ChecklistItemRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
