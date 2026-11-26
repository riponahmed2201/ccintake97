<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $roles = Role::orderBy('name')->get(['id', 'name']);

        $query = User::with('roles:id,name');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $scope = $request->input('scope', 'all');
        if ($scope === 'staff') {
            $query->whereHas('roles', function ($q) {
                $q->whereNotIn('name', ['regular_member', 'verified_member']);
            });
        } elseif ($scope === 'members') {
            $query->whereHas('roles', function ($q) {
                $q->whereIn('name', ['regular_member', 'verified_member']);
            });
        }

        if ($request->filled('role')) {
            $role = $request->input('role');
            $query->whereHas('roles', function ($q) use ($role) {
                $q->where('name', $role);
            });
        }

        if ($request->filled('status')) {
            $query->where('account_status', $request->input('status'));
        }

        $perPage = in_array((int) $request->input('per_page', 20), [10, 20, 50, 100])
            ? (int) $request->input('per_page', 20)
            : 20;

        $users = $query->orderBy('name')->paginate($perPage)->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => [
                'search' => $request->input('search', ''),
                'scope' => $scope,
                'role' => $request->input('role', ''),
                'status' => $request->input('status', ''),
                'per_page' => (string) $perPage,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|email|max:190|unique:users,email',
            'phone' => 'nullable|string|max:30',
            'password' => 'required|string|min:8',
            'roles' => 'required|array|min:1',
            'roles.*' => 'exists:roles,name',
        ]);

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone') ?: null,
            'password' => Hash::make($request->input('password')),
            'account_status' => 'active',
            'email_verified_at' => now(),
        ]);

        $user->syncRoles($request->input('roles'));

        AuditLog::log('user.created', 'users', $user->id, null, [
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $request->input('roles'),
        ]);

        return back()->with('success', "User {$user->name} created successfully.");
    }

    public function assignRoles(Request $request, int $userId): RedirectResponse
    {
        $request->validate([
            'roles' => 'required|array|min:1',
            'roles.*' => 'exists:roles,name',
        ]);

        $user = User::findOrFail($userId);
        $previousRoles = $user->getRoleNames()->toArray();

        $user->syncRoles($request->input('roles'));

        AuditLog::log('roles.assigned', 'users', $user->id, ['roles' => $previousRoles], ['roles' => $request->input('roles')]);

        return back()->with('success', "Roles updated for {$user->name}.");
    }

    public function toggleStatus(Request $request, int $userId): RedirectResponse
    {
        $user = User::findOrFail($userId);

        if ($request->user()?->id === $user->id) {
            return back()->with('error', 'You cannot suspend your own account.');
        }

        $previousStatus = $user->account_status;
        $nextStatus = $previousStatus === 'active' ? 'suspended' : 'active';
        $user->update(['account_status' => $nextStatus]);

        AuditLog::log('user.status_changed', 'users', $user->id, ['account_status' => $previousStatus], ['account_status' => $nextStatus]);

        return back()->with('success', "{$user->name} is now {$nextStatus}.");
    }
}
