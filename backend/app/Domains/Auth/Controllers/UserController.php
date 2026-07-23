<?php

namespace App\Domains\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Domains\Auth\User;
use App\Domains\Auth\Requests\StoreUserRequest;
use App\Domains\Auth\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Get all users.
     */
    public function index()
    {
        $users = User::with('roles')->latest()->get();
        // Transform the user object to include a simple 'role' attribute for the frontend
        $users->transform(function ($user) {
            $user->role = $user->roles->first()?->name ?? 'user';
            return $user;
        });
        return response()->json($users);
    }

    /**
     * Store a new user.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        
        $role = $data['role'] ?? 'user';
        unset($data['role']); // Remove role from data since it's not a column
        unset($data['status']); // Remove status if present (not a column)

        $user = User::create($data);
        $user->assignRole($role);

        return response()->json([
            'message' => 'User berhasil ditambahkan',
            'user' => $user
        ], 201);
    }

    /**
     * Update an existing user.
     */
    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $data = $request->validated();

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']); // Prevent updating password if not provided
        }

        $role = $data['role'] ?? null;
        unset($data['role']);
        unset($data['status']);

        $user->update($data);
        
        if ($role) {
            $user->syncRoles([$role]);
        }

        return response()->json([
            'message' => 'User berhasil diupdate',
            'user' => $user
        ]);
    }

    /**
     * Delete a user.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === request()->user()->id) {
            return response()->json([
                'message' => 'Tidak bisa menghapus akun Anda sendiri'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User berhasil dihapus'
        ]);
    }
}
