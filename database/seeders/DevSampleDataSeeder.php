<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\ApplicationReview;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\Business;
use App\Models\BusinessCategory;
use App\Models\College;
use App\Models\Committee;
use App\Models\CommitteeMember;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\EventGuest;
use App\Models\EventRegistration;
use App\Models\Industry;
use App\Models\Initiative;
use App\Models\Member;
use App\Models\MemberConnection;
use App\Models\MemberPrivacySetting;
use App\Models\MemberProfile;
use App\Models\MembershipApplication;
use App\Models\MembershipVerification;
use App\Models\MentorshipProfile;
use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use App\Models\User;
use App\Services\SequenceService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DevSampleDataSeeder extends Seeder
{
    public function run(): void
    {
        $defaultPassword = Hash::make('password');

        // 1. Super Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@intake97.com'],
            [
                'name' => 'System Administrator',
                'password' => $defaultPassword,
                'email_verified_at' => now(),
                'phone' => '+8801700000000',
                'account_status' => 'active',
                'is_demo' => false,
                'last_activity_at' => now(),
            ]
        );
        $admin->syncRoles(['super_admin', 'association_admin']);

        // 2. Demo Users
        $demoUsersData = [
            ['name' => 'Demo Member Alpha', 'email' => 'alpha@example.test', 'phone' => '+8801000000001', 'status' => 'active'],
            ['name' => 'Demo Member Bravo', 'email' => 'bravo@example.test', 'phone' => '+8801000000002', 'status' => 'active'],
            ['name' => 'Demo Member Charlie', 'email' => 'charlie@example.test', 'phone' => '+8801000000003', 'status' => 'active'],
            ['name' => 'Demo Member Delta', 'email' => 'delta@example.test', 'phone' => '+8801000000004', 'status' => 'active'],
            ['name' => 'Demo Member Echo', 'email' => 'echo@example.test', 'phone' => '+8801000000005', 'status' => 'active'],
            ['name' => 'Demo Member Foxtrot', 'email' => 'foxtrot@example.test', 'phone' => '+8801000000006', 'status' => 'suspended'],
            ['name' => 'Demo Content Editor', 'email' => 'editor@example.test', 'phone' => null, 'status' => 'active'],
            ['name' => 'Demo Event Manager', 'email' => 'eventmgr@example.test', 'phone' => null, 'status' => 'active'],
        ];

        $users = [];
        foreach ($demoUsersData as $d) {
            $user = User::updateOrCreate(
                ['email' => $d['email']],
                [
                    'name' => $d['name'],
                    'password' => $defaultPassword,
                    'email_verified_at' => now(),
                    'phone' => $d['phone'],
                    'account_status' => $d['status'],
                    'is_demo' => true,
                    'last_activity_at' => now(),
                ]
            );
            $users[$d['email']] = $user;
        }

        // Roles for staff
        $users['editor@example.test']->syncRoles(['content_editor']);
        $users['eventmgr@example.test']->syncRoles(['event_manager']);

        // Colleges
        $fcc = College::where('slug', 'faujdarhat-cadet-college')->first();
        $mcc = College::where('slug', 'mirzapur-cadet-college')->first();
        $jcc = College::where('slug', 'jhenaidah-cadet-college')->first();
        $rcc = College::where('slug', 'rajshahi-cadet-college')->first();
        $pcc = College::where('slug', 'pabna-cadet-college')->first();
        $scc = College::where('slug', 'sylhet-cadet-college')->first();

        // Industries
        $it = Industry::where('slug', 'information-technology')->first();
        $eng = Industry::where('slug', 'engineering-construction')->first();
        $med = Industry::where('slug', 'healthcare-medicine')->first();
        $fin = Industry::where('slug', 'banking-finance')->first();

        // 3. Members
        // Alpha (FCC, 1001, Approved, Verified)
        $memberAlpha = Member::updateOrCreate(
            ['user_id' => $users['alpha@example.test']->id],
            [
                'member_code' => SequenceService::next('member_code'),
                'college_id' => $fcc->id,
                'college_roll_no' => '1001',
                'intake_year' => 1997,
                'membership_status' => 'approved',
                'verification_status' => 'verified',
                'approved_at' => now(),
                'verified_at' => now(),
            ]
        );
        $users['alpha@example.test']->syncRoles(['verified_member']);

        // Bravo (MCC, 1002, Pending, Unverified)
        $memberBravo = Member::updateOrCreate(
            ['user_id' => $users['bravo@example.test']->id],
            [
                'member_code' => null,
                'college_id' => $mcc->id,
                'college_roll_no' => '1002',
                'intake_year' => 1997,
                'membership_status' => 'pending',
                'verification_status' => 'unverified',
            ]
        );
        $users['bravo@example.test']->syncRoles(['regular_member']);

        // Charlie (JCC, 1003, Under Review, Pending)
        $memberCharlie = Member::updateOrCreate(
            ['user_id' => $users['charlie@example.test']->id],
            [
                'member_code' => null,
                'college_id' => $jcc->id,
                'college_roll_no' => '1003',
                'intake_year' => 1997,
                'membership_status' => 'under_review',
                'verification_status' => 'pending',
            ]
        );
        $users['charlie@example.test']->syncRoles(['regular_member']);

        // Delta (RCC, 1004, Rejected, Rejected)
        $memberDelta = Member::updateOrCreate(
            ['user_id' => $users['delta@example.test']->id],
            [
                'member_code' => null,
                'college_id' => $rcc->id,
                'college_roll_no' => '1004',
                'intake_year' => 1997,
                'membership_status' => 'rejected',
                'verification_status' => 'rejected',
            ]
        );

        // Echo (PCC, 1005, Approved, Unverified)
        $memberEcho = Member::updateOrCreate(
            ['user_id' => $users['echo@example.test']->id],
            [
                'member_code' => SequenceService::next('member_code'),
                'college_id' => $pcc->id,
                'college_roll_no' => '1005',
                'intake_year' => 1997,
                'membership_status' => 'approved',
                'verification_status' => 'unverified',
                'approved_at' => now(),
            ]
        );
        $users['echo@example.test']->syncRoles(['regular_member']);

        // Foxtrot (SCC, 1006, Suspended, Unverified)
        $memberFoxtrot = Member::updateOrCreate(
            ['user_id' => $users['foxtrot@example.test']->id],
            [
                'member_code' => null,
                'college_id' => $scc->id,
                'college_roll_no' => '1006',
                'intake_year' => 1997,
                'membership_status' => 'suspended',
                'verification_status' => 'unverified',
                'suspended_at' => now(),
                'suspension_reason' => 'Demo: policy breach',
            ]
        );

        // 4. Profiles
        MemberProfile::updateOrCreate(
            ['member_id' => $memberAlpha->id],
            [
                'city' => 'Dhaka',
                'country_code' => 'BD',
                'designation' => 'Software Architect',
                'organization' => 'Example Tech Ltd',
                'industry_id' => $it->id,
                'professional_bio' => 'Passionate software architect with 20+ years in distributed systems.',
                'owns_business' => true,
                'profile_completion' => 85,
            ]
        );

        MemberProfile::updateOrCreate(
            ['member_id' => $memberBravo->id],
            [
                'city' => 'Chattogram',
                'country_code' => 'BD',
                'designation' => 'Civil Engineer',
                'organization' => 'Example Builders',
                'industry_id' => $eng->id,
                'owns_business' => false,
                'profile_completion' => 45,
            ]
        );

        MemberProfile::updateOrCreate(
            ['member_id' => $memberCharlie->id],
            [
                'city' => 'London',
                'country_code' => 'GB',
                'designation' => 'Physician',
                'organization' => 'Example Hospital',
                'industry_id' => $med->id,
                'owns_business' => false,
                'profile_completion' => 50,
            ]
        );

        MemberProfile::updateOrCreate(
            ['member_id' => $memberEcho->id],
            [
                'city' => 'Toronto',
                'country_code' => 'CA',
                'designation' => 'Banker',
                'organization' => 'Example Bank',
                'industry_id' => $fin->id,
                'owns_business' => false,
                'profile_completion' => 60,
            ]
        );

        // 5. Privacy settings for Alpha
        $privacyDefaults = [
            'photo' => 'verified_members',
            'organization' => 'verified_members',
            'designation' => 'verified_members',
            'country' => 'verified_members',
            'city' => 'connections',
            'linkedin' => 'connections',
            'date_of_birth' => 'private',
        ];

        foreach ($privacyDefaults as $field => $vis) {
            MemberPrivacySetting::updateOrCreate(
                ['member_id' => $memberAlpha->id, 'field_key' => $field],
                ['visibility' => $vis]
            );
        }

        // 6. Applications
        $appsData = [
            ['member' => $memberAlpha, 'college' => $fcc, 'roll' => '1001', 'status' => 'approved', 'decided' => true, 'note' => null],
            ['member' => $memberBravo, 'college' => $mcc, 'roll' => '1002', 'status' => 'submitted', 'decided' => false, 'note' => null],
            ['member' => $memberCharlie, 'college' => $jcc, 'roll' => '1003', 'status' => 'under_review', 'decided' => false, 'note' => null],
            ['member' => $memberDelta, 'college' => $rcc, 'roll' => '1004', 'status' => 'rejected', 'decided' => true, 'note' => 'Demo: could not match intake records'],
            ['member' => $memberEcho, 'college' => $pcc, 'roll' => '1005', 'status' => 'approved', 'decided' => true, 'note' => null],
        ];

        foreach ($appsData as $app) {
            $application = MembershipApplication::updateOrCreate(
                ['member_id' => $app['member']->id],
                [
                    'application_no' => SequenceService::next('application_no'),
                    'declared_college_id' => $app['college']->id,
                    'declared_roll_no' => $app['roll'],
                    'status' => $app['status'],
                    'submitted_at' => now(),
                    'decided_at' => $app['decided'] ? now() : null,
                    'decision_note' => $app['note'],
                ]
            );

            if ($app['status'] !== 'submitted') {
                ApplicationReview::create([
                    'application_id' => $application->id,
                    'actor_id' => $admin->id,
                    'action' => 'status_changed',
                    'from_status' => 'submitted',
                    'to_status' => $app['status'],
                    'note' => 'Demo review entry',
                    'is_internal' => true,
                ]);
            }
        }

        // 7. Verification for Alpha
        MembershipVerification::updateOrCreate(
            ['member_id' => $memberAlpha->id],
            [
                'method' => 'committee_manual',
                'result' => 'passed',
                'evidence_note' => 'Demo: manually confirmed by Cadet College alumni committee',
                'verified_by' => $admin->id,
                'verified_at' => now(),
            ]
        );

        // 8. Connection request Alpha -> Echo
        MemberConnection::updateOrCreate(
            ['requester_id' => $memberAlpha->id, 'addressee_id' => $memberEcho->id],
            ['status' => 'pending']
        );

        // 9. Mentorship Profile for Alpha
        MentorshipProfile::updateOrCreate(
            ['member_id' => $memberAlpha->id],
            [
                'is_available' => true,
                'expertise_areas' => 'Software Architecture, Cloud Systems, Career Mentoring',
                'preferred_topics' => 'System Design, Tech Leadership, Career Pivot',
                'consent_given_at' => now(),
            ]
        );

        // 10. Event
        $annualReunionCat = EventCategory::where('slug', 'annual-reunion')->first();
        $event = Event::updateOrCreate(
            ['slug' => 'demo-annual-reunion'],
            [
                'category_id' => $annualReunionCat->id,
                'title' => 'INTAKE 97 Grand Annual Reunion 2027',
                'description' => 'The flagship reunion gathering of 1997 intake Cadet College alumni from across the globe.',
                'starts_on' => now()->addDays(60)->toDateString(),
                'ends_on' => now()->addDays(61)->toDateString(),
                'start_time' => '10:00:00',
                'venue' => 'Army Golf Club Banquet Hall, Dhaka',
                'address' => 'Airport Road, Dhaka 1206',
                'capacity' => 250,
                'allows_guests' => true,
                'max_guests_per_registration' => 2,
                'registration_closes_at' => now()->addDays(45),
                'visibility' => 'members',
                'status' => 'published',
                'published_at' => now(),
                'created_by' => $users['eventmgr@example.test']->id,
            ]
        );

        // Event Registration for Alpha
        $reg = EventRegistration::updateOrCreate(
            ['event_id' => $event->id, 'member_id' => $memberAlpha->id],
            [
                'status' => 'confirmed',
                'guest_count' => 1,
                'qr_token' => sha1('demo-alpha-' . $memberAlpha->id),
            ]
        );

        EventGuest::updateOrCreate(
            ['registration_id' => $reg->id, 'name' => 'Demo Guest Spouse'],
            [
                'relationship' => 'spouse',
                'age_group' => 'adult',
            ]
        );

        // 11. Articles
        $newsCat = ArticleCategory::where('slug', 'association-news')->first();
        Article::updateOrCreate(
            ['slug' => 'demo-welcome-to-intake-97'],
            [
                'category_id' => $newsCat->id,
                'title' => 'Welcome to INTAKE97.COM: Uniting the 1997 Cadet College Network',
                'excerpt' => 'An official welcome message from the INTAKE 97 Central Coordination Committee.',
                'body' => '<p>Welcome batchmates of INTAKE 97. This platform is built to unite all participating Cadet Colleges from our intake year under one reliable, secure, and professional network.</p>',
                'author_id' => $users['editor@example.test']->id,
                'status' => 'published',
                'published_by' => $admin->id,
                'published_at' => now(),
            ]
        );

        $noticesCat = ArticleCategory::where('slug', 'official-announcements')->first();
        Article::updateOrCreate(
            ['slug' => 'demo-draft-awaiting-review'],
            [
                'category_id' => $noticesCat->id,
                'title' => 'Upcoming Executive Committee Election Guidelines',
                'excerpt' => 'Proposed draft guidelines for upcoming association representation.',
                'body' => '<p>Draft documentation under committee review for organizational governance.</p>',
                'author_id' => $users['editor@example.test']->id,
                'status' => 'pending_review',
            ]
        );

        // 12. Business Listing
        $techBizCat = BusinessCategory::where('slug', 'technology-software')->first();
        Business::updateOrCreate(
            ['slug' => 'demo-software-studio'],
            [
                'owner_member_id' => $memberAlpha->id,
                'category_id' => $techBizCat->id,
                'industry_id' => $it->id,
                'name' => 'Demo Software Studio',
                'description' => 'Enterprise web and cloud development agency owned by Intake 97 alumnus.',
                'city' => 'Dhaka',
                'country_code' => 'BD',
                'status' => 'pending',
                'services' => ['Cloud Architecture', 'Web Application Development', 'DevOps Consulting'],
            ]
        );

        // 13. Committee
        $committee = Committee::updateOrCreate(
            ['slug' => 'central-executive-committee-2025-2027'],
            [
                'name' => 'Central Executive Committee (2025-2027)',
                'description' => 'The executive body governing INTAKE 97 alumni affairs and community initiatives.',
                'head_member_id' => $memberAlpha->id,
                'term_start' => now()->startOfYear(),
                'term_end' => now()->addYears(2)->endOfYear(),
                'status' => 'active',
                'display_order' => 1,
            ]
        );

        CommitteeMember::updateOrCreate(
            ['committee_id' => $committee->id, 'member_id' => $memberAlpha->id],
            [
                'position_title' => 'President',
                'role_type' => 'president',
                'display_order' => 1,
                'start_date' => now()->startOfYear(),
            ]
        );

        CommitteeMember::updateOrCreate(
            ['committee_id' => $committee->id, 'member_id' => $memberEcho->id],
            [
                'position_title' => 'Joint Secretary (International Chapters)',
                'role_type' => 'joint_secretary',
                'display_order' => 2,
                'start_date' => now()->startOfYear(),
            ]
        );

        // 14. Initiative
        Initiative::updateOrCreate(
            ['slug' => 'cadet-welfare-assistance-fund'],
            [
                'title' => 'Cadet Welfare & Medical Assistance Fund',
                'category' => 'medical',
                'description' => 'Providing emergency medical and welfare support to batchmates and their immediate families.',
                'coordinator_member_id' => $memberAlpha->id,
                'budget' => 500000.00,
                'target_amount' => 500000.00,
                'raised_amount' => 125000.00,
                'status' => 'active',
                'start_date' => now()->startOfMonth(),
            ]
        );

        // 15. Support Ticket
        $ticket = SupportTicket::updateOrCreate(
            ['ticket_no' => 'TCK97-0001'],
            [
                'user_id' => $users['alpha@example.test']->id,
                'category' => 'membership',
                'subject' => 'Inquiry regarding digital membership card verification',
                'status' => 'open',
                'priority' => 'medium',
                'assigned_to' => $admin->id,
            ]
        );

        SupportTicketMessage::updateOrCreate(
            ['ticket_id' => $ticket->id, 'sender_id' => $users['alpha@example.test']->id],
            [
                'message' => 'Hello Admin, how does the QR verification work at upcoming reunion venues?',
                'is_internal_note' => false,
            ]
        );

        // 16. Activity & Audit Logs
        ActivityLog::create([
            'user_id' => $users['alpha@example.test']->id,
            'member_id' => $memberAlpha->id,
            'activity' => 'profile.updated',
            'subject_type' => 'member',
            'subject_id' => $memberAlpha->id,
        ]);

        DB::table('notifications')->insert([
            'id' => (string) Str::uuid(),
            'type' => 'App\\Notifications\\MembershipApproved',
            'notifiable_type' => 'App\\Models\\User',
            'notifiable_id' => $users['alpha@example.test']->id,
            'category' => 'membership',
            'data' => json_encode(['message' => 'Congratulations! Your membership for INTAKE 97 has been approved and verified.']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
