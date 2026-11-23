<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\College;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\EventRegistration;
use App\Models\Industry;
use App\Models\Member;
use App\Models\MemberPrivacySetting;
use App\Models\MemberProfile;
use App\Models\MembershipApplication;
use App\Models\User;
use Database\Seeders\ReferenceDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class Intake97AlumniSystemTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ReferenceDataSeeder::class);
    }

    public function test_guest_can_view_alumni_registration_screen(): void
    {
        $response = $this->get('/register-alumni');
        $response->assertOk();
    }

    public function test_alumni_registration_creates_pending_member_and_application_with_1997_scope(): void
    {
        $fcc = College::where('short_name', 'FCC')->first();

        $response = $this->post('/register-alumni', [
            'name' => 'Tariq Rahman',
            'email' => 'tariq.97@example.com',
            'phone' => '+8801711000097',
            'password' => 'SecurePass97!',
            'password_confirmation' => 'SecurePass97!',
            'college_id' => $fcc->id,
            'college_roll_no' => '1097',
            'passing_year' => 2003,
            'city' => 'Dhaka',
            'country_code' => 'BD',
            'designation' => 'Lead Architect',
            'organization' => 'Apex Systems',
            'reference_name' => 'Brigadier Gen M. Alam',
            'reference_phone' => '+8801811000000',
        ]);

        $response->assertRedirect('/member/dashboard');

        // Check user creation
        $this->assertDatabaseHas('users', [
            'email' => 'tariq.97@example.com',
            'phone' => '+8801711000097',
            'account_status' => 'active',
        ]);

        $user = User::where('email', 'tariq.97@example.com')->first();

        // Check member record
        $this->assertDatabaseHas('members', [
            'user_id' => $user->id,
            'college_id' => $fcc->id,
            'college_roll_no' => '1097',
            'intake_year' => 1997,
            'membership_status' => 'pending',
            'verification_status' => 'unverified',
        ]);

        $member = Member::where('user_id', $user->id)->first();

        // Check application record with APP97- prefix
        $this->assertDatabaseHas('membership_applications', [
            'member_id' => $member->id,
            'declared_college_id' => $fcc->id,
            'declared_roll_no' => '1097',
            'status' => 'submitted',
        ]);

        $application = MembershipApplication::where('member_id', $member->id)->first();
        $this->assertStringStartsWith('APP97-', $application->application_no);
    }

    public function test_alumni_registration_succeeds_with_only_essential_fields(): void
    {
        $mcc = College::where('short_name', 'MCC')->first();

        $response = $this->post('/register-alumni', [
            'name' => 'Navid Huq',
            'email' => 'navid.97@example.com',
            'password' => 'SecurePass97!',
            'password_confirmation' => 'SecurePass97!',
            'college_id' => $mcc->id,
            'college_roll_no' => '721',
        ]);

        $response->assertRedirect('/member/dashboard');

        $member = User::where('email', 'navid.97@example.com')->first()->member;
        $this->assertSame('pending', $member->membership_status);
        $this->assertDatabaseHas('member_profiles', [
            'member_id' => $member->id,
            'country_code' => 'BD',
        ]);
        $this->assertDatabaseHas('membership_applications', [
            'member_id' => $member->id,
            'declared_roll_no' => '721',
            'status' => 'submitted',
        ]);
    }

    public function test_admin_can_approve_application_and_assign_sequenced_member_code(): void
    {
        // Setup admin user
        $admin = User::factory()->create(['account_status' => 'active']);
        $admin->assignRole('association_admin');

        // Setup candidate member & application
        $fcc = College::where('short_name', 'FCC')->first();
        $candidateUser = User::factory()->create(['account_status' => 'active']);
        $candidateMember = Member::create([
            'user_id' => $candidateUser->id,
            'college_id' => $fcc->id,
            'college_roll_no' => '1088',
            'intake_year' => 1997,
            'membership_status' => 'pending',
            'verification_status' => 'unverified',
        ]);

        $app = MembershipApplication::create([
            'application_no' => 'APP97-0099',
            'member_id' => $candidateMember->id,
            'declared_college_id' => $fcc->id,
            'declared_roll_no' => '1088',
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        // Action: Admin approves
        $response = $this->actingAs($admin)->post("/admin/applications/{$app->id}/decide", [
            'status' => 'approved',
            'note' => 'College batch list cross-verified.',
        ]);

        $response->assertSessionHas('success');

        $app->refresh();
        $candidateMember->refresh();

        $this->assertEquals('approved', $app->status);
        $this->assertEquals('approved', $candidateMember->membership_status);
        $this->assertNotNull($candidateMember->member_code);
        $this->assertStringStartsWith('M97-', $candidateMember->member_code);
        $this->assertTrue($candidateUser->fresh()->hasRole('regular_member'));
    }

    public function test_unverified_member_cannot_access_directory(): void
    {
        $fcc = College::where('short_name', 'FCC')->first();
        $user = User::factory()->create(['account_status' => 'active']);
        $user->assignRole('regular_member');

        $member = Member::create([
            'user_id' => $user->id,
            'college_id' => $fcc->id,
            'college_roll_no' => '1099',
            'intake_year' => 1997,
            'membership_status' => 'approved',
            'verification_status' => 'unverified', // Unverified!
        ]);

        $response = $this->actingAs($user)->get('/member/directory');
        $response->assertForbidden();
    }

    public function test_verified_member_can_access_directory_with_privacy_masking(): void
    {
        $fcc = College::where('short_name', 'FCC')->first();

        // 1. Target member with private phone setting
        $targetUser = User::factory()->create([
            'name' => 'Secret Alumni',
            'email' => 'secret@intake97.com',
            'phone' => '+8801999999999',
            'account_status' => 'active',
        ]);
        $targetMember = Member::create([
            'user_id' => $targetUser->id,
            'college_id' => $fcc->id,
            'college_roll_no' => '1044',
            'intake_year' => 1997,
            'membership_status' => 'approved',
            'verification_status' => 'verified',
            'member_code' => 'M97-0044',
        ]);
        MemberProfile::create([
            'member_id' => $targetMember->id,
            'country_code' => 'BD',
            'city' => 'Dhaka',
            'designation' => 'Executive Officer',
        ]);
        MemberPrivacySetting::create([
            'member_id' => $targetMember->id,
            'field_key' => 'phone',
            'visibility' => 'private', // Masked!
        ]);

        // 2. Viewer member (verified)
        $viewerUser = User::factory()->create(['account_status' => 'active']);
        $viewerUser->assignRole('regular_member');
        Member::create([
            'user_id' => $viewerUser->id,
            'college_id' => $fcc->id,
            'college_roll_no' => '1045',
            'intake_year' => 1997,
            'membership_status' => 'approved',
            'verification_status' => 'verified',
            'member_code' => 'M97-0045',
        ]);

        $response = $this->actingAs($viewerUser)->get('/member/directory');
        $response->assertOk();

        // Ensure masked phone is not leaked
        $pageData = $response->viewData('page');
        $members = $pageData['props']['members']['data'] ?? [];
        $found = collect($members)->firstWhere('id', $targetMember->id);

        $this->assertNotNull($found);
        $this->assertEquals('[Private]', $found['user']['phone']);
    }

    public function test_event_registration_and_qr_attendance_checkin(): void
    {
        $fcc = College::where('short_name', 'FCC')->first();
        $cat = EventCategory::first();

        $admin = User::factory()->create(['account_status' => 'active']);
        $admin->assignRole('super_admin');

        $event = Event::create([
            'category_id' => $cat->id,
            'created_by' => $admin->id,
            'title' => 'Silver Jubilee Reunion 1997',
            'slug' => 'silver-jubilee-reunion-1997',
            'description' => '25+ year intake gathering.',
            'venue' => 'Dhaka Club',
            'starts_on' => now()->addDays(10)->toDateString(),
            'registration_fee' => 0,
            'visibility' => 'members',
            'status' => 'published',
            'allows_guests' => true,
            'max_guests_per_registration' => 2,
        ]);

        $user = User::factory()->create(['account_status' => 'active']);
        $user->assignRole('regular_member');
        $member = Member::create([
            'user_id' => $user->id,
            'college_id' => $fcc->id,
            'college_roll_no' => '1022',
            'intake_year' => 1997,
            'membership_status' => 'approved',
            'verification_status' => 'verified',
            'member_code' => 'M97-0022',
        ]);

        // Member registers for event
        $regResponse = $this->actingAs($user)->post("/member/events/{$event->slug}/register", [
            'special_requirements' => 'Vegetarian meal',
            'guests' => [
                ['name' => 'Spouse Rahman', 'relationship' => 'Spouse', 'age_group' => 'Adult'],
            ],
        ]);

        $regResponse->assertSessionHas('success');

        $registration = EventRegistration::where('event_id', $event->id)
            ->where('member_id', $member->id)
            ->first();

        $this->assertNotNull($registration);
        $this->assertNotEmpty($registration->qr_token);
        $this->assertEquals(1, $registration->guest_count);

        // Admin verifies & checks in attendee using QR code
        $checkinResponse = $this->actingAs($admin)->post('/admin/events/checkin', [
            'qr_token' => $registration->qr_token,
        ]);

        $checkinResponse->assertSessionHas('success');
        $registration->refresh();

        $this->assertEquals('attended', $registration->status);
        $this->assertNotNull($registration->checked_in_at);
    }
}
