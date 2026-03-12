<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Get all users (public)
     */
    public function index(): JsonResponse
    {
        $users = User::with('marketItems')->latest()->get();

        return response()->json([
            'message' => 'Users fetched successfully',
            'data'    => $users,
        ]);
    }

    /**
     * Profile user yang sedang login
     */
    public function me(): JsonResponse
    {
        $user = User::with('marketItems')->find(Auth::id());

        return response()->json([
            'message' => 'Profile fetched successfully',
            'data'    => $user,
        ]);
    }

    /**
     * Profile user by ID (public)
     */
    public function show(int $id): JsonResponse
    {
        $user = User::with('marketItems')->findOrFail($id);

        return response()->json([
            'message' => 'User fetched successfully',
            'data'    => $user,
        ]);
    }

    /**
     * Update nama user
     */
    public function updateName(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user = Auth::user();
        $user->name = $request->name;
        $user->save();

        return response()->json([
            'message' => 'Nama berhasil diperbarui',
            'data'    => $user,
        ]);
    }

    /**
     * Update password user
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current' => 'required|string',
            'new'     => 'required|string|min:6|confirmed',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current, $user->password)) {
            return response()->json([
                'message' => 'Password saat ini tidak sesuai',
            ], 422);
        }

        $user->password = Hash::make($request->new);
        $user->save();

        return response()->json([
            'message' => 'Password berhasil diperbarui',
        ]);
    }

    public function updateAvatar(Request $request): JsonResponse
{
    $request->validate([
        'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
    ]);

    /** @var User $user */
    $user = Auth::user();

    // Hapus avatar lama
    if ($user->avatar) {
        Storage::disk('public')->delete($user->avatar);
    }

    $path = $request->file('avatar')->store('avatars', 'public');
    $user->avatar = $path;
    $user->save();

    return response()->json([
        'message' => 'Avatar berhasil diperbarui',
        'data'    => $user,
    ]);
}
}