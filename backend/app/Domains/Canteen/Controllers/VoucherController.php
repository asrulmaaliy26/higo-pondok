<?php

namespace App\Domains\Canteen\Controllers;

use App\Http\Controllers\Controller;
use App\Domains\Canteen\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VoucherController extends Controller
{
    public function index()
    {
        // Public route: list active vouchers
        $vouchers = Voucher::where('is_active', true)
            ->where('valid_until', '>=', now())
            ->get();
            
        return response()->json($vouchers);
    }

    public function canteenVouchers(Request $request)
    {
        $canteen = $request->user()->canteen()->first();
        if (!$canteen) {
            return response()->json(['message' => 'Not a canteen owner'], 403);
        }

        $vouchers = Voucher::where('canteen_id', $canteen->id)->orderBy('created_at', 'desc')->get();
        return response()->json($vouchers);
    }

    public function store(Request $request)
    {
        $canteen = $request->user()->canteen()->first();
        if (!$canteen) {
            return response()->json(['message' => 'Not a canteen owner'], 403);
        }

        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:vouchers,code',
            'discount_amount' => 'required|numeric|min:0',
            'min_purchase' => 'required|numeric|min:0',
            'valid_until' => 'nullable|date',
            'is_active' => 'boolean'
        ]);

        $validated['canteen_id'] = $canteen->id;
        $validated['code'] = Str::upper($validated['code']);

        $voucher = Voucher::create($validated);

        return response()->json($voucher, 201);
    }

    public function update(Request $request, $id)
    {
        $canteen = $request->user()->canteen()->first();
        if (!$canteen) {
            return response()->json(['message' => 'Not a canteen owner'], 403);
        }

        $voucher = Voucher::where('canteen_id', $canteen->id)->findOrFail($id);

        $validated = $request->validate([
            'code' => 'string|max:20|unique:vouchers,code,' . $id,
            'discount_amount' => 'numeric|min:0',
            'min_purchase' => 'numeric|min:0',
            'valid_until' => 'nullable|date',
            'is_active' => 'boolean'
        ]);

        if (isset($validated['code'])) {
            $validated['code'] = Str::upper($validated['code']);
        }

        $voucher->update($validated);

        return response()->json($voucher);
    }

    public function destroy(Request $request, $id)
    {
        $canteen = $request->user()->canteen()->first();
        if (!$canteen) {
            return response()->json(['message' => 'Not a canteen owner'], 403);
        }

        $voucher = Voucher::where('canteen_id', $canteen->id)->findOrFail($id);
        $voucher->delete();

        return response()->json(['message' => 'Voucher deleted successfully']);
    }
}
