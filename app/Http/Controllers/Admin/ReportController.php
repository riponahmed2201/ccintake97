<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\Event;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(): Response
    {
        $collegeBreakdown = College::where('is_participating', true)
            ->withCount('members')
            ->orderBy('display_order')
            ->get();

        $statusBreakdown = Member::selectRaw('membership_status, count(*) as count')
            ->groupBy('membership_status')
            ->pluck('count', 'membership_status');

        $verificationBreakdown = Member::selectRaw('verification_status, count(*) as count')
            ->groupBy('verification_status')
            ->pluck('count', 'verification_status');

        $eventsBreakdown = Event::withCount('registrations')
            ->latest('starts_on')
            ->limit(10)
            ->get();

        return Inertia::render('admin/reports/index', [
            'collegeBreakdown' => $collegeBreakdown,
            'statusBreakdown' => $statusBreakdown,
            'verificationBreakdown' => $verificationBreakdown,
            'eventsBreakdown' => $eventsBreakdown,
        ]);
    }

    public function download(string $type): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"intake97_report_{$type}_" . date('Y-m-d') . '.csv"',
        ];

        return response()->stream(function () use ($type) {
            $handle = fopen('php://output', 'w');

            if ($type === 'colleges') {
                fputcsv($handle, ['College Name', 'Short Name', 'Established', 'Participating', 'Registered Members']);
                $colleges = College::withCount('members')->get();
                foreach ($colleges as $c) {
                    fputcsv($handle, [$c->name, $c->short_name, $c->established_year, $c->is_participating ? 'Yes' : 'No', $c->members_count]);
                }
            } else {
                fputcsv($handle, ['Member ID', 'Name', 'Email', 'Cadet College', 'Status', 'Verification']);
                $members = Member::with(['user', 'college'])->get();
                foreach ($members as $m) {
                    fputcsv($handle, [$m->member_code ?? 'N/A', $m->user->name ?? '', $m->user->email ?? '', $m->college->name ?? '', $m->membership_status, $m->verification_status]);
                }
            }

            fclose($handle);
        }, 200, $headers);
    }
}
