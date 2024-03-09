<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    public function store(StoreUserRequest $request)
    {
        $input = $request->all();

        $existingUser = User::where('email', $input['email'])->first();
        if ($existingUser) {
            $response = [
                'status' => false,
                'statusCode' => 404,
                'message' => 'Email is already registered',
            ];
            return response()->json($response, 401); // 400 Bad Request
        }


        $input['password'] = bcrypt($input['password']);

        if (empty($input['token']) || $input['token'] != env('REGISTER_TOKEN')) {
            $response = [
                'status' => false,
                'message' => 'You are not authorized'
            ];
            return response()->json($response, 404);
        }

        $user = User::create($input);
        
        $data['id'] = $user->id;
        $data['name'] = $user->name;
        $data['token'] = $user->createToken('MyAppToken')->plainTextToken;

        $response = [
            'status' => true,
            'data' => $data,
        ];

        return response()->json($response, 200);
    }

    public function login(Request $request)
    {
        $input = $request->all();

        $credentials = [
            'email' => $input['email'],
            'password' => $input['password']
        ];

        if (Auth::attempt($credentials)) {

            // $request->session()->regenerate();
            $user = Auth::user();


            $token = $user->createToken('MyAppToken')->plainTextToken;

            $response = [
                'status' => true,
                'user' => $user,
                'token' => $token,
            ];

            return response()->json($response, 200);

            
        }

       
        $response = [
            'status' => false,
            'message' => 'Invalid Credentials'
        ];
        return response()->json($response, 404);
    }

    public function logout(Request $request)
    {
        if ($request->user()->currentAccessToken()->delete()) {
            $response = [
                'status' => true,
                'message' => 'Logged out successfully'
            ];
            return response()->json($response, 200);
        }
        else {
            return response()->json(['status' => false], 404);
        }   

        // return redirect('/login');
    }

    public function me(Request $request)
    {
        
        if (!Auth::user()) {
            return response()->json(['status' => false], 403);
        }

        $user = Auth::user();

        $response = [
            'user' => $user,
            'status' => true,
        ];
        return response()->json($response, 200);
    }

    // public function show($id)
    // {

    //     if ($id !== Auth::user()->id) {
    //         return response()->json(['status' => false], 403);
    //     }

    //     $user = User::with('organizations', 'folders')->find($id);
    //     if (!$user) {
    //         $response = [
    //             'status' => false,
    //             'message' => 'User not found'
    //         ];
    //         return response()->json($response, 404);
    //     }

    //     $response = [
    //         'status' => true,
    //         'data' => $user
    //     ];

    //     return response()->json($response, 200);
    // }
   
}
