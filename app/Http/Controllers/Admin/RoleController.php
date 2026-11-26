<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Role::with('permissions:id,name')->withCount(['users', 'permissions']);

        if ($request->filled('search')) {
            $search = str_replace(' ', '_', trim($request->input('search')));
            $query->where('name', 'like', "%{$search}%");
        }

        $perPage = in_array((int) $request->input('per_page', 20), [10, 20, 50, 100])
            ? (int) $request->input('per_page', 20)
            : 20;

        $roles = $query->orderBy('name')->paginate($perPage)->withQueryString();

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
            'permissions' => Permission::orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $request->input('search', ''),
                'per_page' => (string) $perPage,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:80',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $normalizedName = Str::slug($request->input('name'), '_');
        if ($normalizedName === '') {
            return back()->withErrors(['name' => 'Role name must contain letters or numbers.']);
        }

        if (Role::where('name', $normalizedName)->where('guard_name', 'web')->exists()) {
            return back()->withErrors(['name' => 'A role with this name already exists.']);
        }

        $role = Role::create([
            'name' => $normalizedName,
            'guard_name' => 'web',
        ]);

        $perms = $request->input('permissions', []);
        if (!empty($perms)) {
            $role->syncPermissions($perms);
        }

        AuditLog::log('role.created', 'roles', $role->id, null, [
            'name' => $role->name,
            'permissions' => $perms,
        ]);

        return back()->with('success', 'Role "' . str_replace('_', ' ', $role->name) . '" created.');
    }

    public function update(Request $request, int $roleId): RedirectResponse
    {
        $role = Role::findOrFail($roleId);

        $request->validate([
            'name' => 'required|string|max:80',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $protectedRoles = ['super_admin', 'regular_member', 'verified_member'];
        $normalizedName = in_array($role->name, $protectedRoles, true)
            ? $role->name
            : Str::slug($request->input('name'), '_');

        if ($normalizedName === '') {
            return back()->withErrors(['name' => 'Role name must contain letters or numbers.']);
        }

        if (
            Role::where('name', $normalizedName)
                ->where('guard_name', 'web')
                ->where('id', '!=', $role->id)
                ->exists()
        ) {
            return back()->withErrors(['name' => 'A role with this name already exists.']);
        }

        $previous = [
            'name' => $role->name,
            'permissions' => $role->permissions()->pluck('name')->toArray(),
        ];

        $role->update(['name' => $normalizedName]);
        $perms = $request->input('permissions', []);
        $role->syncPermissions($perms);

        AuditLog::log('role.updated', 'roles', $role->id, $previous, [
            'name' => $role->name,
            'permissions' => $perms,
        ]);

        return back()->with('success', 'Role "' . str_replace('_', ' ', $role->name) . '" updated.');
    }

    public function destroy(int $roleId): RedirectResponse
    {
        $role = Role::findOrFail($roleId);
        $protectedRoles = ['super_admin', 'regular_member', 'verified_member'];

        if (in_array($role->name, $protectedRoles, true)) {
            return back()->with('error', 'System default role "' . str_replace('_', ' ', $role->name) . '" cannot be deleted.');
        }

        if ($role->users()->count() > 0) {
            return back()->with('error', 'Cannot delete role while users are assigned to it.');
        }

        $deletedName = $role->name;
        $role->delete();

        AuditLog::log('role.deleted', 'roles', $roleId, ['name' => $deletedName], null);

        return back()->with('success', 'Role "' . str_replace('_', ' ', $deletedName) . '" deleted.');
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
