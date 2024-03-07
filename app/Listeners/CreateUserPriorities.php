<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Registered;
use App\Models\Priority;
use App\Models\Task;


use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CreateUserPriorities
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Registered $event)
    {
        // Access the newly registered user from the event
        $user = $event->user;

        // Define default priorities (you can customize this)
        $priorities = [
            ['name' => 'Highest', 'color' => '#F44336'],
            ['name' => 'High', 'color' => '#9C27B0'],
            ['name' => 'Medium', 'color' => '#007BFF'],
            ['name' => 'Low', 'color' => '#3F51B5'],

        ];

        // Create priorities for the user's tasks
        foreach ($priorities as $priorityData) {
            $priority = new Priority($priorityData);
            $user->tasks()->priorities()->save($priority);
        }
    }
}
