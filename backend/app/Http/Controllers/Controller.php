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
                $userName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $userName);
                $userName = trim(preg_replace('/_+/', '_', $userName), '_') ?: 'user';
            }
        }

        $rolesStr = preg_replace('/[^a-zA-Z0-9_-]/', '_', $rolesStr);
        $basePath = $rolesStr . '_' . $userName;

        return $subFolder ? $basePath . '/' . $subFolder : $basePath;
    }

    /**
     * Store and optimize/compress image files automatically.
     * Resizes large images (max 1600px) and compresses quality to 80% using PHP GD.
     * Falls back to normal store() if not a compressible image or if GD fails.
     * 
     * @param \Illuminate\Http\UploadedFile $file
     * @param \App\Models\User|\Illuminate\Foundation\Auth\User $user
     * @param string|null $subFolder
     * @param string $disk
     * @return string
     */
    protected function storeOptimizedImage($file, $user, $subFolder = null, $disk = 'public')
    {
        $dir = $this->getUserUploadPath($user, $subFolder);
        
        // If not an image or GD is not available, store directly
        if (!extension_loaded('gd') || !str_starts_with($file->getMimeType(), 'image/')) {
            return $file->store($dir, $disk);
        }

        try {
            $pathname = $file->getPathname();
            $imageContent = file_get_contents($pathname);
            $srcImg = @imagecreatefromstring($imageContent);

            if (!$srcImg) {
                return $file->store($dir, $disk);
            }

            $origWidth = imagesx($srcImg);
            $origHeight = imagesy($srcImg);

            $maxWidth = 1600;
            $maxHeight = 1600;

            $newWidth = $origWidth;
            $newHeight = $origHeight;

            if ($origWidth > $maxWidth || $origHeight > $maxHeight) {
                if ($origWidth > $origHeight) {
                    $newHeight = (int) round(($origHeight * $maxWidth) / $origWidth);
                    $newWidth = $maxWidth;
                } else {
                    $newWidth = (int) round(($origWidth * $maxHeight) / $origHeight);
                    $newHeight = $maxHeight;
                }
            }

            $targetImg = imagecreatetruecolor($newWidth, $newHeight);

            // Handle transparency for PNG / WebP
            imagealphablending($targetImg, false);
            imagesavealpha($targetImg, true);
            $transparent = imagecolorallocatealpha($targetImg, 255, 255, 255, 127);
            imagefilledrectangle($targetImg, 0, 0, $newWidth, $newHeight, $transparent);
            imagealphablending($targetImg, true);

            imagecopyresampled($targetImg, $srcImg, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);

            // Output to memory buffer as WebP or JPEG
            ob_start();
            if (function_exists('imagewebp')) {
                imagewebp($targetImg, null, 80);
                $ext = 'webp';
            } else {
                imagejpeg($targetImg, null, 80);
                $ext = 'jpg';
            }
            $compressedData = ob_get_clean();

            imagedestroy($srcImg);
            imagedestroy($targetImg);

            $filename = \Illuminate\Support\Str::random(40) . '.' . $ext;
            $fullPath = $dir . '/' . $filename;

            \Illuminate\Support\Facades\Storage::disk($disk)->put($fullPath, $compressedData);

            return $fullPath;
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Image optimization fallback: " . $e->getMessage());
            return $file->store($dir, $disk);
        }
    }
}
