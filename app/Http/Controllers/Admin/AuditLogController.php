<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $query = AuditLog::with('user')->latest('created_at');

        if ($module = $request->input('module')) {
            $query->where('module', $module);
        }

        if ($action = $request->input('action')) {
            $query->where(function ($q) use ($action) {
                $q->where('action', 'like', "%{$action}%")
                    ->orWhereHas('user', function ($uq) use ($action) {
                        $uq->where('name', 'like', "%{$action}%");
                    });
            });
        }

        $perPage = (int) $request->input('per_page', 20);
        if (! in_array($perPage, [10, 20, 50, 100], true)) {
            $perPage = 20;
        }

        $logs = $query->paginate($perPage)->withQueryString();
        $modules = AuditLog::query()->distinct()->orderBy('module')->pluck('module');

        return Inertia::render('admin/audit-logs/index', [
            'logs' => $logs,
            'modules' => $modules,
            'filters' => array_merge(
                $request->only(['module', 'action']),
                ['per_page' => (string) $perPage]
            ),
        ]);
    }
}
