<?php

namespace App\Services;
use Illuminate\Support\Facades\Auth;


class AuthService
{
    public function isAuthenticated($id): bool
    {
        if ($id !== Auth::user()->id) { 
            return false;
        }

        return true;
    }
}
