<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\EventRegistration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request): Response
    {
        $events = Event::with('category')
            ->withCount('registrations')
            ->latest('starts_on')
            ->paginate(10);

        return Inertia::render('admin/events/index', [
            'events' => $events,
        ]);
    }

    public function create(): Response
    {
        $categories = EventCategory::orderBy('display_order')->get(['id', 'name']);

        return Inertia::render('admin/events/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:event_categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'venue' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'google_maps_link' => 'nullable|url|max:500',
            'starts_on' => 'required|date',
            'ends_on' => 'nullable|date|after_or_equal:starts_on',
            'start_time' => 'nullable',
            'end_time' => 'nullable',
            'capacity' => 'nullable|integer|min:1',
            'allows_guests' => 'boolean',
            'max_guests_per_registration' => 'integer|min:0|max:10',
            'registration_closes_at' => 'nullable|date',
            'registration_fee' => 'numeric|min:0',
            'visibility' => 'required|in:public,members,verified_members',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);
        $validated['created_by'] = auth()->id();
        $validated['status'] = 'draft';

        $event = Event::create($validated);
        AuditLog::log('event.created', 'events', $event->id, null, $event->toArray());

        return redirect()->route('admin.events.index')->with('success', 'Event draft created.');
    }

    public function edit(int $id): Response
    {
        $event = Event::findOrFail($id);
        $categories = EventCategory::orderBy('display_order')->get(['id', 'name']);

        return Inertia::render('admin/events/edit', [
            'event' => $event,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $event = Event::findOrFail($id);
        $previous = $event->toArray();

        $validated = $request->validate([
            'category_id' => 'required|exists:event_categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'venue' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'google_maps_link' => 'nullable|url|max:500',
            'starts_on' => 'required|date',
            'ends_on' => 'nullable|date|after_or_equal:starts_on',
            'start_time' => 'nullable',
            'end_time' => 'nullable',
            'capacity' => 'nullable|integer|min:1',
            'allows_guests' => 'boolean',
            'max_guests_per_registration' => 'integer|min:0|max:10',
            'registration_closes_at' => 'nullable|date',
            'registration_fee' => 'numeric|min:0',
            'visibility' => 'required|in:public,members,verified_members',
            'status' => 'required|in:draft,published,cancelled,completed',
        ]);

        if ($validated['status'] === 'published' && ! $event->published_at) {
            $validated['published_at'] = now();
        }

        $event->update($validated);
        AuditLog::log('event.updated', 'events', $event->id, $previous, $event->fresh()->toArray());

        return redirect()->route('admin.events.index')->with('success', 'Event updated successfully.');
    }

    public function publish(int $id): RedirectResponse
    {
        $event = Event::findOrFail($id);
        $event->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        AuditLog::log('event.published', 'events', $event->id, ['status' => 'draft'], ['status' => 'published']);

        return back()->with('success', "Event '{$event->title}' published.");
    }

    public function registrations(int $id): Response
    {
        $event = Event::with('category')->findOrFail($id);
        $registrations = EventRegistration::with(['member.user', 'member.college', 'guests', 'checkedInBy'])
            ->where('event_id', $id)
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/events/registrations', [
            'event' => $event,
            'registrations' => $registrations,
        ]);
    }

    public function checkin(Request $request): JsonResponse|RedirectResponse
    {
        $request->validate([
            'qr_token' => 'required|string',
        ]);

        $reg = EventRegistration::with(['member.user', 'event'])
            ->where('qr_token', $request->input('qr_token'))
            ->first();

        if (! $reg) {
            if ($request->wantsJson()) {
                return response()->json(['success' => false, 'message' => 'Invalid ticket / QR code.'], 404);
            }
            return back()->with('error', 'Invalid ticket / QR code.');
        }

        if ($reg->checked_in_at) {
            $msg = "Ticket was already checked in at {$reg->checked_in_at->format('h:i A')}.";
            if ($request->wantsJson()) {
                return response()->json(['success' => false, 'message' => $msg, 'registration' => $reg], 400);
            }
            return back()->with('error', $msg);
        }

        $reg->update([
            'status' => 'attended',
            'checked_in_at' => now(),
            'checked_in_by' => auth()->id(),
        ]);

        AuditLog::log('event.checkin', 'events', $reg->event_id, null, ['registration_id' => $reg->id, 'member' => $reg->member->user->name]);

        $successMsg = "Check-in confirmed for {$reg->member->user->name} (+{$reg->guest_count} guests).";
        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => $successMsg, 'registration' => $reg]);
        }
        return back()->with('success', $successMsg);
    }
}
