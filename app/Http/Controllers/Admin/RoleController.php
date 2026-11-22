<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(): Response
    {
        $roles = Role::with('permissions')->get();
        $staffUsers = User::with('roles')
            ->whereHas('roles', function ($q) {
                $q->whereNotIn('name', ['regular_member', 'verified_member']);
            })
            ->get();

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
            'staffUsers' => $staffUsers,
        ]);
    }

    public function assign(Request $request, int $userId): RedirectResponse
    {
        $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,name',
        ]);

        $user = User::findOrFail($userId);
        $previousRoles = $user->getRoleNames()->toArray();

        $user->syncRoles($request->input('roles'));

        AuditLog::log('roles.assigned', 'roles', $user->id, ['roles' => $previousRoles], ['roles' => $request->input('roles')]);

        return back()->with('success', "Roles updated for {$user->name}.");
    }
}
