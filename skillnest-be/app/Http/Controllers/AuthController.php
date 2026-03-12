<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // REGISTER
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        // Hanya return user, tanpa token
        return response()->json([
            'user' => $user
        ]);
    }

    // LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        // Buat token API baru hanya saat login
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function loginAdmin(Request $request)
{
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required'
    ]);

    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json(['message' => 'Email atau password salah'], 401);
    }

    $user = Auth::user();

    // Cek apakah user adalah admin
    if ($user->role !== 'admin') {
        Auth::logout();
        return response()->json(['message' => 'Akses ditolak. Hanya admin yang dapat masuk.'], 403);
    }

    $token = $user->createToken('admin-token')->plainTextToken;

    return response()->json([
        'user'  => $user,
        'token' => $token
    ]);
}

    // LOGOUT
    public function logout(Request $request)
    {
        // Revoke semua token user
        $request->user()->tokens()->delete();

        Auth::logout();

        return response()->json(['message' => 'Logged out']);
    }
}