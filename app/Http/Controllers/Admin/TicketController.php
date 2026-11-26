<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function index(Request $request): Response
    {
        $query = SupportTicket::with(['user', 'assignedAgent'])
            ->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('ticket_no', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($priority = $request->input('priority')) {
            $query->where('priority', $priority);
        }

        $perPage = (int) $request->input('per_page', 10);
        if (! in_array($perPage, [10, 25, 50, 100], true)) {
            $perPage = 10;
        }

        $tickets = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/tickets/index', [
            'tickets' => $tickets,
            'filters' => array_merge(
                $request->only(['search', 'status', 'priority']),
                ['per_page' => (string) $perPage]
            ),
        ]);
    }

    public function show(int $id): Response
    {
        $ticket = SupportTicket::with(['user', 'assignedAgent', 'messages.sender'])
            ->findOrFail($id);

        return Inertia::render('admin/tickets/show', [
            'ticket' => $ticket,
        ]);
    }

    public function reply(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'message' => 'required|string',
            'is_internal_note' => 'boolean',
        ]);

        $ticket = SupportTicket::findOrFail($id);

        SupportTicketMessage::create([
            'ticket_id' => $ticket->id,
            'sender_id' => auth()->id(),
            'message' => $request->input('message'),
            'is_internal_note' => $request->boolean('is_internal_note'),
        ]);

        if (! $request->boolean('is_internal_note') && $ticket->status === 'open') {
            $ticket->update(['status' => 'waiting_member']);
        }

        return back()->with('success', 'Reply sent successfully.');
    }

    public function updateStatus(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:open,in_progress,waiting_member,resolved,closed',
        ]);

        $ticket = SupportTicket::findOrFail($id);
        $previous = $ticket->status;
        $ticket->update(['status' => $request->input('status')]);

        AuditLog::log('ticket.status_updated', 'tickets', $ticket->id, ['status' => $previous], ['status' => $request->input('status')]);

        return back()->with('success', "Ticket status updated to {$request->input('status')}.");
    }
}
