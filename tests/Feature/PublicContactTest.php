<?php

namespace Tests\Feature;

use App\Mail\ContactInquiryReceived;
use App\Models\ContactInquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PublicContactTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_inquiry_is_stored_and_emailed(): void
    {
        Mail::fake();

        $response = $this->post('/contact', [
            'name' => 'Test Batchmate',
            'email' => 'batchmate@example.test',
            'subject' => 'Membership question',
            'message' => 'How do I verify my college roll number?',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseCount('contact_inquiries', 1);
        $inquiry = ContactInquiry::first();
        $this->assertSame('batchmate@example.test', $inquiry->email);
        Mail::assertSent(ContactInquiryReceived::class, fn ($mail) => $mail->inquiry->is($inquiry));
    }

    public function test_contact_requires_valid_fields(): void
    {
        $response = $this->post('/contact', []);

        $response->assertSessionHasErrors(['name', 'email', 'subject', 'message']);
        $this->assertDatabaseCount('contact_inquiries', 0);
    }
}