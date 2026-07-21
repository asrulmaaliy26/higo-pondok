<?php

namespace App\Http\Controllers;

abstract class Controller
{
    /**
     * Get the dynamic upload path based on user role and name.
     * Format: {role}_{nama_pengguna} (all spaces replaced with underscore and lowercase).
     * Example: kantin_budi_santoso
     * 
     * @param \App\Models\User|\Illuminate\Foundation\Auth\User $user
     * @param string|null $subFolder Optional subfolder, e.g., 'products', 'avatars'
     * @return string
     */
    protected function getUserUploadPath($user, $subFolder = null)
    {
        $rolesStr = 'user';
        if ($user && method_exists($user, 'roles') && $user->roles) {
            $roles = $user->roles->pluck('name')->map(function($r) {
                return strtolower(str_replace(' ', '_', $r));
            })->toArray();
            
            if (!empty($roles)) {
                $rolesStr = implode('_', $roles);
            }
        }

        $userName = 'guest';
        if ($user) {
            $nameToUse = $user->santri_name ?: $user->name;
            if ($nameToUse) {
                $userName = strtolower(str_replace(' ', '_', $nameToUse));
            }
        }

        $basePath = $rolesStr . '_' . $userName;

        return $subFolder ? $basePath . '/' . $subFolder : $basePath;
    }
}
