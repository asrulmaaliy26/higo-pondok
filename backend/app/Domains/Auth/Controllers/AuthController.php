<?php

namespace App\Domains\Auth\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Domains\Auth\User;
use Illuminate\Validation\ValidationException;
use App\Domains\Auth\Requests\UpdateProfileRequest;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial yang diberikan tidak cocok dengan data kami.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('roles'),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Berhasil logout'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('roles'),
        ]);
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = $request->user();
        
        if ($request->has('name')) {
            $user->name = $request->name;
        }
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        
        $santriFields = ['santri_name', 'santri_room', 'santri_class', 'santri_level'];
        foreach ($santriFields as $field) {
            if ($request->has($field)) {
                $user->$field = $request->$field;
            }
        }
        
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $dir = $this->getUserUploadPath($user, 'avatars');
            $fileName = time() . '_' . $request->file('avatar')->getClientOriginalName();
            $path = $request->file('avatar')->storeAs($dir, $fileName, 'public');
            $user->avatar = $path;
        }
        
        $user->save();

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'user' => $user->load('roles'),
        ]);
    }

    public function toggleWorkingStatus(Request $request)
    {
        $user = $request->user();
        if (!$user->hasRole('kurir')) {
            return response()->json(['message' => 'Hanya kurir yang dapat mengubah status kerja'], 403);
        }

        $user->is_working = !$user->is_working;
        $user->save();

        return response()->json([
            'message' => 'Status kerja berhasil diubah',
            'is_working' => $user->is_working
        ]);
    }
}
