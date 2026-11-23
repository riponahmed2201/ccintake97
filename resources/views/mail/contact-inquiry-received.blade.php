New contact inquiry from the public website:

Name: {{ $inquiry->name }}
Email: {{ $inquiry->email }}
Subject: {{ $inquiry->subject }}

Message:
{{ $inquiry->message }}

---
Inquiry #{{ $inquiry->id }} · {{ $inquiry->created_at->toDateTimeString() }}