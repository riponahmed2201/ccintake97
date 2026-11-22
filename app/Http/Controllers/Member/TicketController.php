<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function index(Request $request): Response
    {
        $tickets = SupportTicket::with('assignedAgent')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('member/tickets/index', [
            'tickets' => $tickets,
        ]);
    }

    public function show(Request $request, int $id): Response
    {
        $ticket = SupportTicket::with(['assignedAgent', 'messages.sender'])
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return Inertia::render('member/tickets/show', [
            'ticket' => $ticket,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|in:general,membership,event,business,technical,other',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'priority' => 'required|in:low,medium,high,urgent',
        ]);

        $ticketNo = 'TCK97-' . str_pad((string) (SupportTicket::count() + 1), 4, '0', STR_PAD_LEFT);

        DB::transaction(function () use ($request, $validated, $ticketNo) {
            $ticket = SupportTicket::create([
                'ticket_no' => $ticketNo,
                'user_id' => $request->user()->id,
                'category' => $validated['category'],
                'subject' => $validated['subject'],
                'priority' => $validated['priority'],
                'status' => 'open',
            ]);

            SupportTicketMessage::create([
                'ticket_id' => $ticket->id,
                'sender_id' => $request->user()->id,
                'message' => $validated['message'],
                'is_internal_note' => false,
            ]);
        });

        return back()->with('success', "Support ticket {$ticketNo} submitted.");
    }

    public function reply(Request $request, int $id): RedirectResponse
    {
        $ticket = SupportTicket::where('user_id', $request->user()->id)->findOrFail($id);

        $request->validate(['message' => 'required|string']);

        SupportTicketMessage::create([
            'ticket_id' => $ticket->id,
            'sender_id' => $request->user()->id,
            'message' => $request->input('message'),
            'is_internal_note' => false,
        ]);

        if ($ticket->status === 'resolved' || $ticket->status === 'closed') {
            $ticket->update(['status' => 'open']);
        }

        return back()->with('success', 'Message sent.');
    }
}
