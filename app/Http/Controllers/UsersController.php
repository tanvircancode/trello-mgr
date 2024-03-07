<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Registered;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    // Dispatch the Registered event with the user instance
    // Event::dispatch(new Registered($user));
}
