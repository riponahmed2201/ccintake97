<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventGuest;
use App\Models\EventRegistration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request): Response
    {
        $member = $request->user()->member;

        $events = Event::with('category')
            ->where('status', 'published')
            ->orderBy('starts_on')
            ->get();

        $myRegistrations = $member ? EventRegistration::with(['event.category', 'guests'])
            ->where('member_id', $member->id)
            ->latest()
            ->get() : collect();

        return Inertia::render('member/events/index', [
            'events' => $events,
            'myRegistrations' => $myRegistrations,
        ]);
    }

    public function show(Request $request, string $slug): Response
    {
        $member = $request->user()->member;
        $event = Event::with('category')->where('slug', $slug)->firstOrFail();

        $myRegistration = $member ? EventRegistration::with('guests')
            ->where('event_id', $event->id)
            ->where('member_id', $member->id)
            ->first() : null;

        return Inertia::render('member/events/show', [
            'event' => $event,
            'myRegistration' => $myRegistration,
        ]);
    }

    public function register(Request $request, string|int $id): RedirectResponse
    {
        $member = $request->user()->member;
        if (! $member) abort(403);

        $event = is_numeric($id) ? Event::findOrFail((int) $id) : Event::where('slug', $id)->firstOrFail();
        if ($event->status !== 'published') {
            return back()->with('error', 'Registration is closed for this event.');
        }

        $existing = EventRegistration::where('event_id', $event->id)
            ->where('member_id', $member->id)
            ->first();

        if ($existing) {
            return back()->with('info', 'You are already registered for this event.');
        }

        $validated = $request->validate([
            'guest_count' => 'integer|min:0|max:5',
            'special_requirements' => 'nullable|string|max:500',
            'guests' => 'nullable|array',
            'guests.*.name' => 'required_with:guests|string|max:100',
            'guests.*.relationship' => 'nullable|string|max:50',
            'guests.*.age_group' => 'nullable|string|max:30',
        ]);

        DB::transaction(function () use ($event, $member, $validated) {
            $qrToken = sha1("reg-{$event->id}-{$member->id}-" . microtime());

            $reg = EventRegistration::create([
                'event_id' => $event->id,
                'member_id' => $member->id,
                'status' => 'confirmed',
                'guest_count' => $validated['guest_count'] ?? (! empty($validated['guests']) ? count($validated['guests']) : 0),
                'special_requirements' => $validated['special_requirements'] ?? null,
                'qr_token' => $qrToken,
            ]);

            if (! empty($validated['guests'])) {
                foreach ($validated['guests'] as $g) {
                    EventGuest::create([
                        'registration_id' => $reg->id,
                        'name' => $g['name'],
                        'relationship' => $g['relationship'] ?? 'guest',
                        'age_group' => $g['age_group'] ?? 'adult',
                    ]);
                }
            }
        });

        return back()->with('success', 'You have successfully registered for this event!');
    }

    public function cancel(Request $request, int $registrationId): RedirectResponse
    {
        $member = $request->user()->member;
        $reg = EventRegistration::where('id', $registrationId)
            ->where('member_id', $member->id)
            ->firstOrFail();

        $reg->delete();

        return back()->with('success', 'Event registration cancelled.');
    }
}
