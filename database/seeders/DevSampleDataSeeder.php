<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\ApplicationReview;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\AuditLog;
use App\Models\Business;
use App\Models\BusinessCategory;
use App\Models\College;
use App\Models\Committee;
use App\Models\CommitteeMember;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\EventGuest;
use App\Models\EventRegistration;
use App\Models\GalleryAlbum;
use App\Models\GalleryMedia;
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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DevSampleDataSeeder extends Seeder
{
    private function installAsset(string $sourceRelative, string $targetRelative): ?string
    {
        $source = database_path('seeders/assets/' . ltrim($sourceRelative, '/'));
        if (! is_file($source)) {
            return null;
        }

        $disk = Storage::disk('public');
        if (! $disk->exists($targetRelative)) {
            $disk->put($targetRelative, file_get_contents($source));
        }

        return $targetRelative;
    }

    public function run(): void
    {
        $defaultPassword = Hash::make('password');

        // Install seeded images onto public storage disk
        $avatar1 = $this->installAsset('avatars/avatar-1.jpg', 'avatars/avatar-1.jpg');
        $avatar2 = $this->installAsset('avatars/avatar-2.jpg', 'avatars/avatar-2.jpg');
        $avatar3 = $this->installAsset('avatars/avatar-3.jpg', 'avatars/avatar-3.jpg');
        $avatar4 = $this->installAsset('avatars/avatar-4.jpg', 'avatars/avatar-4.jpg');

        $eventReunionImg = $this->installAsset('events/event-reunion.jpg', 'events/event-reunion.jpg');
        $eventSportsImg = $this->installAsset('events/event-sports.jpg', 'events/event-sports.jpg');

        $newsLeadershipImg = $this->installAsset('articles/news-leadership.jpg', 'articles/news-leadership.jpg');
        $newsWelfareImg = $this->installAsset('articles/news-welfare.jpg', 'articles/news-welfare.jpg');

        $bizTechLogo = $this->installAsset('businesses/biz-tech.jpg', 'businesses/biz-tech.jpg');
        $bizEngLogo = $this->installAsset('businesses/biz-eng.jpg', 'businesses/biz-eng.jpg');

        // 1. Super Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@intake97.com'],
            [
                'name' => 'Col. (Retd.) Tariqul Islam',
                'password' => $defaultPassword,
                'email_verified_at' => now(),
                'phone' => '+8801711000097',
                'avatar_path' => $avatar4,
                'account_status' => 'active',
                'is_demo' => false,
                'last_activity_at' => now(),
            ]
        );
        $admin->syncRoles(['super_admin', 'association_admin']);

        // 2. Alumni & Staff Users
        $demoUsersData = [
            ['name' => 'Tanvir Ahmed Chowdhury', 'email' => 'alpha@example.test', 'phone' => '+8801711223344', 'status' => 'active', 'avatar' => $avatar1],
            ['name' => 'Engr. Mahmudul Hasan', 'email' => 'bravo@example.test', 'phone' => '+8801712334455', 'status' => 'active', 'avatar' => $avatar2],
            ['name' => 'Dr. Farhana Rahman', 'email' => 'charlie@example.test', 'phone' => '+447700900123', 'status' => 'active', 'avatar' => $avatar3],
            ['name' => 'Kamrul Islam Bhuiyan', 'email' => 'delta@example.test', 'phone' => '+8801819556677', 'status' => 'active', 'avatar' => $avatar2],
            ['name' => 'Nafis Chowdhury', 'email' => 'echo@example.test', 'phone' => '+14165550197', 'status' => 'active', 'avatar' => $avatar4],
            ['name' => 'Sajjad Hossain Khan', 'email' => 'foxtrot@example.test', 'phone' => '+8801911889900', 'status' => 'suspended', 'avatar' => $avatar1],
            ['name' => 'Asifur Rahman (Editorial)', 'email' => 'editor@example.test', 'phone' => '+8801715443322', 'status' => 'active', 'avatar' => $avatar2],
            ['name' => 'Rezwan Kabir (Events)', 'email' => 'eventmgr@example.test', 'phone' => '+8801716554433', 'status' => 'active', 'avatar' => $avatar4],
            ['name' => 'Barrister Zahidul Haque', 'email' => 'zahid@intake97.com', 'phone' => '+8801713998877', 'status' => 'active', 'avatar' => $avatar4],
            ['name' => 'Dr. Nusrat Jahan', 'email' => 'nusrat@intake97.com', 'phone' => '+8801714776655', 'status' => 'active', 'avatar' => $avatar3],
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
                    'avatar_path' => $d['avatar'],
                    'account_status' => $d['status'],
                    'is_demo' => true,
                    'last_activity_at' => now(),
                ]
            );
            $users[$d['email']] = $user;
        }

        $users['editor@example.test']->syncRoles(['content_editor']);
        $users['eventmgr@example.test']->syncRoles(['event_manager']);

        // Colleges
        $fcc = College::where('slug', 'faujdarhat-cadet-college')->first();
        $mcc = College::where('slug', 'mirzapur-cadet-college')->first();
        $jcc = College::where('slug', 'jhenaidah-cadet-college')->first();
        $rcc = College::where('slug', 'rajshahi-cadet-college')->first();
        $pcc = College::where('slug', 'pabna-cadet-college')->first();
        $scc = College::where('slug', 'sylhet-cadet-college')->first();
        $ccr = College::where('slug', 'rangpur-cadet-college')->first();
        $mgcc = College::where('slug', 'mymensingh-girls-cadet-college')->first();

        // Industries
        $it = Industry::where('slug', 'information-technology')->first();
        $eng = Industry::where('slug', 'engineering-construction')->first();
        $med = Industry::where('slug', 'healthcare-medicine')->first();
        $fin = Industry::where('slug', 'banking-finance')->first();
        $law = Industry::where('slug', 'legal-judiciary')->first();

        // 3. Members
        $memberAlpha = Member::updateOrCreate(
            ['user_id' => $users['alpha@example.test']->id],
            [
                'member_code' => SequenceService::next('member_code'),
                'college_id' => $fcc->id,
                'college_roll_no' => '1942',
                'intake_year' => 1997,
                'membership_status' => 'approved',
                'verification_status' => 'verified',
                'approved_at' => now()->subMonths(6),
                'verified_at' => now()->subMonths(6),
            ]
        );
        $users['alpha@example.test']->syncRoles(['verified_member']);

        $memberBravo = Member::updateOrCreate(
            ['user_id' => $users['bravo@example.test']->id],
            [
                'member_code' => null,
                'college_id' => $mcc->id,
                'college_roll_no' => '1815',
                'intake_year' => 1997,
                'membership_status' => 'pending',
                'verification_status' => 'unverified',
            ]
        );
        $users['bravo@example.test']->syncRoles(['regular_member']);

        $memberCharlie = Member::updateOrCreate(
            ['user_id' => $users['charlie@example.test']->id],
            [
                'member_code' => null,
                'college_id' => $mgcc->id,
                'college_roll_no' => '0612',
                'intake_year' => 1997,
                'membership_status' => 'under_review',
                'verification_status' => 'pending',
            ]
        );
        $users['charlie@example.test']->syncRoles(['regular_member']);

        $memberDelta = Member::updateOrCreate(
            ['user_id' => $users['delta@example.test']->id],
            [
                'member_code' => null,
                'college_id' => $rcc->id,
                'college_roll_no' => '1528',
                'intake_year' => 1997,
                'membership_status' => 'rejected',
                'verification_status' => 'rejected',
            ]
        );

        $memberEcho = Member::updateOrCreate(
            ['user_id' => $users['echo@example.test']->id],
            [
                'member_code' => SequenceService::next('member_code'),
                'college_id' => $pcc->id,
                'college_roll_no' => '1205',
                'intake_year' => 1997,
                'membership_status' => 'approved',
                'verification_status' => 'verified',
                'approved_at' => now()->subMonths(4),
                'verified_at' => now()->subMonths(4),
            ]
        );
        $users['echo@example.test']->syncRoles(['verified_member']);

        $memberFoxtrot = Member::updateOrCreate(
            ['user_id' => $users['foxtrot@example.test']->id],
            [
                'member_code' => null,
                'college_id' => $scc->id,
                'college_roll_no' => '1106',
                'intake_year' => 1997,
                'membership_status' => 'suspended',
                'verification_status' => 'unverified',
                'suspended_at' => now()->subDays(12),
                'suspension_reason' => 'Incomplete cadet verification records under committee review',
            ]
        );

        $memberZahid = Member::updateOrCreate(
            ['user_id' => $users['zahid@intake97.com']->id],
            [
                'member_code' => SequenceService::next('member_code'),
                'college_id' => $jcc->id,
                'college_roll_no' => '2109',
                'intake_year' => 1997,
                'membership_status' => 'approved',
                'verification_status' => 'verified',
                'approved_at' => now()->subMonths(5),
                'verified_at' => now()->subMonths(5),
            ]
        );
        $users['zahid@intake97.com']->syncRoles(['verified_member']);

        $memberNusrat = Member::updateOrCreate(
            ['user_id' => $users['nusrat@intake97.com']->id],
            [
                'member_code' => SequenceService::next('member_code'),
                'college_id' => $ccr->id,
                'college_roll_no' => '0944',
                'intake_year' => 1997,
                'membership_status' => 'approved',
                'verification_status' => 'verified',
                'approved_at' => now()->subMonths(3),
                'verified_at' => now()->subMonths(3),
            ]
        );
        $users['nusrat@intake97.com']->syncRoles(['verified_member']);

        // 4. Profiles (with rich present/permanent addresses & family details)
        MemberProfile::updateOrCreate(
            ['member_id' => $memberAlpha->id],
            [
                'cadet_name' => 'Cadet Tanvir',
                'gender' => 'male',
                'date_of_birth' => '1984-05-14',
                'blood_group' => 'B+',
                'city' => 'Dhaka',
                'country_code' => 'BD',
                'present_address_line' => 'House 42, Road 11, Banani',
                'present_area' => 'Banani',
                'present_postal_code' => '1213',
                'same_as_present_address' => false,
                'permanent_address_line' => '18/A Panchlaish Residential Area',
                'permanent_area' => 'Panchlaish',
                'permanent_city' => 'Chattogram',
                'permanent_postal_code' => '4203',
                'permanent_country_code' => 'BD',
                'spouse_name' => 'Samira Yasmin',
                'spouse_occupation' => 'Architect',
                'spouse_job_location' => 'Dhaka',
                'children_names' => ['Zayan Ahmed', 'Aaira Ahmed'],
                'designation' => 'Principal Software Architect',
                'job_type' => 'Private Sector',
                'organization' => 'Apex Cloud Systems Ltd.',
                'office_address' => 'Level 9, Gulshan Avenue, Dhaka 1212',
                'office_phone' => '+88029881122',
                'industry_id' => $it->id,
                'professional_bio' => 'Ex-FCC (42nd Intake) with 20+ years in enterprise cloud platforms and distributed systems.',
                'linkedin_url' => 'https://linkedin.com/in/tanvir-intake97',
                'website_url' => 'https://apexcloud.example.com',
                'owns_business' => true,
                'profile_completion' => 95,
            ]
        );

        MemberProfile::updateOrCreate(
            ['member_id' => $memberBravo->id],
            [
                'cadet_name' => 'Cadet Mahmud',
                'gender' => 'male',
                'blood_group' => 'O+',
                'city' => 'Chattogram',
                'country_code' => 'BD',
                'present_address_line' => 'Flat 5B, Nasirabad Housing Society',
                'present_area' => 'Nasirabad',
                'present_postal_code' => '4000',
                'designation' => 'Senior Structural Engineer',
                'job_type' => 'Private Sector',
                'organization' => 'Delta Infrastructure Builders',
                'industry_id' => $eng->id,
                'professional_bio' => 'Specializing in bridge and commercial high-rise structural engineering.',
                'owns_business' => true,
                'profile_completion' => 70,
            ]
        );

        MemberProfile::updateOrCreate(
            ['member_id' => $memberCharlie->id],
            [
                'cadet_name' => 'Cadet Farhana',
                'gender' => 'female',
                'blood_group' => 'A+',
                'city' => 'London',
                'country_code' => 'GB',
                'present_address_line' => '14 Kensington High Street',
                'present_area' => 'Kensington',
                'present_postal_code' => 'W8 4PT',
                'designation' => 'Consultant Physician (Internal Medicine)',
                'job_type' => 'Healthcare',
                'organization' => 'St. Mary’s NHS Trust',
                'industry_id' => $med->id,
                'professional_bio' => 'Alumna of MGCC 97, serving as consultant physician in London.',
                'owns_business' => false,
                'profile_completion' => 75,
            ]
        );

        MemberProfile::updateOrCreate(
            ['member_id' => $memberEcho->id],
            [
                'cadet_name' => 'Cadet Nafis',
                'gender' => 'male',
                'blood_group' => 'AB+',
                'city' => 'Toronto',
                'country_code' => 'CA',
                'present_address_line' => '210 Bay Street, Suite 1400',
                'present_area' => 'Downtown Toronto',
                'present_postal_code' => 'M5J 2T3',
                'spouse_name' => 'Nadia Chowdhury',
                'spouse_occupation' => 'Financial Analyst',
                'children_names' => ['Rayyan Chowdhury'],
                'designation' => 'Vice President, Corporate Banking',
                'job_type' => 'Banking & Finance',
                'organization' => 'NorthBridge Capital Bank',
                'industry_id' => $fin->id,
                'professional_bio' => 'Coordinating CCINTAKE 97 North America chapter outreach and alumni mentorship.',
                'owns_business' => false,
                'profile_completion' => 85,
            ]
        );

        MemberProfile::updateOrCreate(
            ['member_id' => $memberZahid->id],
            [
                'cadet_name' => 'Cadet Zahid',
                'gender' => 'male',
                'blood_group' => 'O+',
                'city' => 'Dhaka',
                'country_code' => 'BD',
                'present_address_line' => 'House 19, Road 7, Dhanmondi',
                'present_area' => 'Dhanmondi',
                'present_postal_code' => '1205',
                'designation' => 'Advocate, Supreme Court of Bangladesh',
                'job_type' => 'Legal Practice',
                'organization' => 'Haque & Associates Chambers',
                'industry_id' => $law->id,
                'professional_bio' => 'Corporate and constitutional law practitioner advising alumni enterprises.',
                'owns_business' => true,
                'profile_completion' => 80,
            ]
        );

        MemberProfile::updateOrCreate(
            ['member_id' => $memberNusrat->id],
            [
                'cadet_name' => 'Cadet Nusrat',
                'gender' => 'female',
                'blood_group' => 'B+',
                'city' => 'Dhaka',
                'country_code' => 'BD',
                'present_address_line' => 'Apartment 8C, Baridhara DOHS',
                'present_area' => 'Baridhara',
                'present_postal_code' => '1206',
                'designation' => 'Associate Professor of Pediatrics',
                'job_type' => 'Healthcare',
                'organization' => 'Dhaka Medical College Hospital',
                'industry_id' => $med->id,
                'professional_bio' => 'Leading CCINTAKE 97 medical camp and child health outreach initiatives.',
                'owns_business' => false,
                'profile_completion' => 85,
            ]
        );

        // 5. Privacy settings
        $privacyDefaults = [
            'photo' => 'public',
            'organization' => 'public',
            'designation' => 'public',
            'country' => 'public',
            'city' => 'public',
            'linkedin' => 'connections',
            'date_of_birth' => 'private',
        ];

        foreach ([$memberAlpha, $memberEcho, $memberZahid, $memberNusrat] as $verifiedMember) {
            foreach ($privacyDefaults as $field => $vis) {
                MemberPrivacySetting::updateOrCreate(
                    ['member_id' => $verifiedMember->id, 'field_key' => $field],
                    ['visibility' => $vis]
                );
            }
        }

        // 6. Applications
        $appsData = [
            ['member' => $memberAlpha, 'college' => $fcc, 'roll' => '1942', 'status' => 'approved', 'decided' => true, 'note' => null],
            ['member' => $memberBravo, 'college' => $mcc, 'roll' => '1815', 'status' => 'submitted', 'decided' => false, 'note' => null],
            ['member' => $memberCharlie, 'college' => $mgcc, 'roll' => '0612', 'status' => 'under_review', 'decided' => false, 'note' => null],
            ['member' => $memberDelta, 'college' => $rcc, 'roll' => '1528', 'status' => 'rejected', 'decided' => true, 'note' => 'Cadet roll number mismatch with 1997 intake register'],
            ['member' => $memberEcho, 'college' => $pcc, 'roll' => '1205', 'status' => 'approved', 'decided' => true, 'note' => null],
            ['member' => $memberZahid, 'college' => $jcc, 'roll' => '2109', 'status' => 'approved', 'decided' => true, 'note' => null],
            ['member' => $memberNusrat, 'college' => $ccr, 'roll' => '0944', 'status' => 'approved', 'decided' => true, 'note' => null],
        ];

        foreach ($appsData as $app) {
            $application = MembershipApplication::updateOrCreate(
                ['member_id' => $app['member']->id],
                [
                    'application_no' => SequenceService::next('application_no'),
                    'declared_college_id' => $app['college']->id,
                    'declared_roll_no' => $app['roll'],
                    'status' => $app['status'],
                    'submitted_at' => now()->subDays(rand(5, 60)),
                    'decided_at' => $app['decided'] ? now()->subDays(rand(1, 4)) : null,
                    'decision_note' => $app['note'],
                ]
            );

            if ($app['status'] !== 'submitted' && ApplicationReview::where('application_id', $application->id)->count() === 0) {
                ApplicationReview::create([
                    'application_id' => $application->id,
                    'actor_id' => $admin->id,
                    'action' => 'status_changed',
                    'from_status' => 'submitted',
                    'to_status' => $app['status'],
                    'note' => 'Verified against college alumni roll.',
                    'is_internal' => true,
                ]);
            }
        }

        // 7. Verifications
        foreach ([$memberAlpha, $memberEcho, $memberZahid, $memberNusrat] as $vm) {
            MembershipVerification::updateOrCreate(
                ['member_id' => $vm->id],
                [
                    'method' => 'committee_manual',
                    'result' => 'passed',
                    'evidence_note' => 'Confirmed by respective Cadet College 1997 intake representative',
                    'verified_by' => $admin->id,
                    'verified_at' => now()->subMonths(2),
                ]
            );
        }

        // 8. Connections & Mentorship
        MemberConnection::updateOrCreate(
            ['requester_id' => $memberAlpha->id, 'addressee_id' => $memberEcho->id],
            ['status' => 'accepted']
        );
        MemberConnection::updateOrCreate(
            ['requester_id' => $memberAlpha->id, 'addressee_id' => $memberZahid->id],
            ['status' => 'accepted']
        );
        MemberConnection::updateOrCreate(
            ['requester_id' => $memberNusrat->id, 'addressee_id' => $memberAlpha->id],
            ['status' => 'pending']
        );

        MentorshipProfile::updateOrCreate(
            ['member_id' => $memberAlpha->id],
            [
                'is_available' => true,
                'expertise_areas' => 'Software Architecture, Cloud Systems, Startup Engineering',
                'preferred_topics' => 'System Design, Engineering Leadership, Career Transition',
                'consent_given_at' => now()->subMonths(3),
            ]
        );
        MentorshipProfile::updateOrCreate(
            ['member_id' => $memberEcho->id],
            [
                'is_available' => true,
                'expertise_areas' => 'Corporate Finance, International Banking, North America Relocation',
                'preferred_topics' => 'Fintech Strategy, Cross-border Investments',
                'consent_given_at' => now()->subMonths(2),
            ]
        );

        // 9. Events with Cover Images
        $annualReunionCat = EventCategory::where('slug', 'annual-reunion')->first();
        $sportsCat = EventCategory::where('slug', 'sports-recreation')->first();

        $eventReunion = Event::updateOrCreate(
            ['slug' => 'demo-annual-reunion'],
            [
                'category_id' => $annualReunionCat->id,
                'title' => 'CCINTAKE 97 Grand Annual Reunion 2027',
                'description' => 'The flagship reunion gathering of 1997 intake Cadet College alumni and families from across the globe.',
                'starts_on' => now()->addDays(45)->toDateString(),
                'ends_on' => now()->addDays(46)->toDateString(),
                'start_time' => '18:30:00',
                'end_time' => '23:00:00',
                'venue' => 'Army Golf Club Banquet Hall, Dhaka',
                'address' => 'Airport Road, Dhaka Cantonment, Dhaka 1206',
                'cover_image_path' => $eventReunionImg,
                'capacity' => 300,
                'allows_guests' => true,
                'max_guests_per_registration' => 3,
                'registration_closes_at' => now()->addDays(35),
                'registration_fee' => 2500,
                'visibility' => 'members',
                'status' => 'published',
                'published_at' => now()->subDays(10),
                'created_by' => $users['eventmgr@example.test']->id,
            ]
        );

        $eventGolf = Event::updateOrCreate(
            ['slug' => 'intake-97-inter-college-golf-cup'],
            [
                'category_id' => $sportsCat->id,
                'title' => 'CCINTAKE 97 Inter-College Golf & Family Day',
                'description' => 'Morning tee-off tournament followed by brunch and family sports activities at Kurmitola Golf Club.',
                'starts_on' => now()->addDays(22)->toDateString(),
                'ends_on' => now()->addDays(22)->toDateString(),
                'start_time' => '07:30:00',
                'end_time' => '14:00:00',
                'venue' => 'Kurmitola Golf Club, Dhaka',
                'address' => 'Dhaka Cantonment, Dhaka 1206',
                'cover_image_path' => $eventSportsImg,
                'capacity' => 120,
                'allows_guests' => true,
                'max_guests_per_registration' => 2,
                'registration_closes_at' => now()->addDays(18),
                'registration_fee' => 1500,
                'visibility' => 'verified_members',
                'status' => 'published',
                'published_at' => now()->subDays(5),
                'created_by' => $users['eventmgr@example.test']->id,
            ]
        );

        // Event Registrations & Guests
        $regAlpha = EventRegistration::updateOrCreate(
            ['event_id' => $eventReunion->id, 'member_id' => $memberAlpha->id],
            [
                'status' => 'confirmed',
                'guest_count' => 1,
                'qr_token' => sha1('reunion-alpha-' . $memberAlpha->id),
            ]
        );
        EventGuest::updateOrCreate(
            ['registration_id' => $regAlpha->id, 'name' => 'Samira Yasmin'],
            ['relationship' => 'spouse', 'age_group' => 'adult']
        );

        EventRegistration::updateOrCreate(
            ['event_id' => $eventReunion->id, 'member_id' => $memberZahid->id],
            [
                'status' => 'confirmed',
                'guest_count' => 0,
                'qr_token' => sha1('reunion-zahid-' . $memberZahid->id),
            ]
        );

        EventRegistration::updateOrCreate(
            ['event_id' => $eventGolf->id, 'member_id' => $memberAlpha->id],
            [
                'status' => 'attended',
                'guest_count' => 0,
                'qr_token' => sha1('golf-alpha-' . $memberAlpha->id),
                'checked_in_at' => now()->subHours(2),
            ]
        );

        // 10. Articles with Cover Images
        $newsCat = ArticleCategory::where('slug', 'association-news')->first();
        $noticesCat = ArticleCategory::where('slug', 'official-announcements')->first();

        Article::updateOrCreate(
            ['slug' => 'demo-welcome-to-intake-97'],
            [
                'category_id' => $newsCat->id,
                'title' => 'Welcome to CCINTAKE97.COM: Uniting the 1997 Cadet College Network',
                'excerpt' => 'An official welcome message from the CCINTAKE 97 Central Coordination Committee.',
                'body' => '<p>Welcome batchmates of CCINTAKE 97. This platform unites all participating Cadet Colleges from our 1997 intake year under one verified, secure, and collaborative alumni network.</p>',
                'cover_image_path' => $newsLeadershipImg,
                'author_id' => $users['editor@example.test']->id,
                'status' => 'published',
                'published_by' => $admin->id,
                'published_at' => now()->subDays(14),
            ]
        );

        Article::updateOrCreate(
            ['slug' => 'intake-97-medical-outreach-camp-report'],
            [
                'category_id' => $newsCat->id,
                'title' => 'Intake 97 Free Medical & Scholarship Outreach Reaches 400+ Families',
                'excerpt' => 'Alumni physicians and volunteers conducted a full-day health camp and distributed school kits.',
                'body' => '<p>Led by our alumni medical chapter, the weekend outreach camp provided specialist consultations, essential medicines, and educational stipends to rural students.</p>',
                'cover_image_path' => $newsWelfareImg,
                'author_id' => $users['editor@example.test']->id,
                'status' => 'published',
                'published_by' => $admin->id,
                'published_at' => now()->subDays(3),
            ]
        );

        Article::updateOrCreate(
            ['slug' => 'demo-draft-awaiting-review'],
            [
                'category_id' => $noticesCat->id,
                'title' => 'Upcoming Executive Committee Election Guidelines 2027',
                'excerpt' => 'Proposed draft guidelines for upcoming association representation and chapter voting.',
                'body' => '<p>Draft documentation under committee review for organizational governance.</p>',
                'cover_image_path' => $newsLeadershipImg,
                'author_id' => $users['editor@example.test']->id,
                'status' => 'pending_review',
            ]
        );

        $this->call(NewsDispatchSeeder::class);

        // 11. Businesses with Logos
        $techBizCat = BusinessCategory::where('slug', 'technology-software')->first();
        $engBizCat = BusinessCategory::where('slug', 'engineering-consultancy')->first()
            ?? BusinessCategory::first();

        Business::updateOrCreate(
            ['slug' => 'demo-software-studio'],
            [
                'owner_member_id' => $memberAlpha->id,
                'category_id' => $techBizCat->id,
                'industry_id' => $it->id,
                'name' => 'Apex Cloud Systems Ltd.',
                'description' => 'Enterprise cloud architecture, web platforms, and DevOps consulting owned by Intake 97 alumnus.',
                'city' => 'Dhaka',
                'country_code' => 'BD',
                'website' => 'https://apexcloud.example.com',
                'logo_path' => $bizTechLogo,
                'status' => 'approved',
                'is_featured' => true,
                'services' => ['Cloud Architecture', 'Web Application Development', 'DevOps Consulting'],
            ]
        );

        Business::updateOrCreate(
            ['slug' => 'delta-infrastructure-builders'],
            [
                'owner_member_id' => $memberBravo->id,
                'category_id' => $engBizCat->id,
                'industry_id' => $eng->id,
                'name' => 'Delta Infrastructure Builders',
                'description' => 'Structural consultancy, commercial construction, and turnkey civil engineering solutions.',
                'city' => 'Chattogram',
                'country_code' => 'BD',
                'website' => 'https://deltabuilders.example.com',
                'logo_path' => $bizEngLogo,
                'status' => 'pending',
                'is_featured' => false,
                'services' => ['Structural Design', 'Commercial Construction', 'Project Management'],
            ]
        );

        // 12. Committees
        $committee = Committee::updateOrCreate(
            ['slug' => 'central-executive-committee-2025-2027'],
            [
                'name' => 'Central Executive Committee (2025-2027)',
                'description' => 'The executive body governing CCINTAKE 97 alumni affairs and community initiatives.',
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
            ['committee_id' => $committee->id, 'member_id' => $memberZahid->id],
            [
                'position_title' => 'General Secretary',
                'role_type' => 'general_secretary',
                'display_order' => 2,
                'start_date' => now()->startOfYear(),
            ]
        );

        CommitteeMember::updateOrCreate(
            ['committee_id' => $committee->id, 'member_id' => $memberEcho->id],
            [
                'position_title' => 'Joint Secretary (International Chapters)',
                'role_type' => 'joint_secretary',
                'display_order' => 3,
                'start_date' => now()->startOfYear(),
            ]
        );

        // 13. Initiatives
        Initiative::updateOrCreate(
            ['slug' => 'cadet-welfare-assistance-fund'],
            [
                'title' => 'Cadet Welfare & Medical Assistance Fund',
                'category' => 'medical',
                'description' => 'Providing emergency medical and welfare support to batchmates and their immediate families.',
                'coordinator_member_id' => $memberNusrat->id,
                'budget' => 500000.00,
                'target_amount' => 500000.00,
                'raised_amount' => 285000.00,
                'status' => 'active',
                'start_date' => now()->startOfMonth(),
            ]
        );

        Initiative::updateOrCreate(
            ['slug' => 'intake-97-merit-scholarship'],
            [
                'title' => 'Intake 97 Merit Scholarship Program',
                'category' => 'scholarship',
                'description' => 'Annual educational stipends for underprivileged meritorious students across Cadet College districts.',
                'coordinator_member_id' => $memberEcho->id,
                'budget' => 300000.00,
                'target_amount' => 300000.00,
                'raised_amount' => 190000.00,
                'status' => 'active',
                'start_date' => now()->subMonths(1)->startOfMonth(),
            ]
        );

        // 14. Gallery Album & Media
        $album = GalleryAlbum::updateOrCreate(
            ['slug' => 'intake-97-highlights-2026'],
            [
                'title' => 'CCINTAKE 97 Reunion & Welfare Highlights',
                'description' => 'Selected moments from alumni gatherings, golf day, executive meetings, and community outreach.',
                'cover_image_path' => $eventReunionImg,
                'event_id' => $eventReunion->id,
                'display_order' => 1,
                'is_published' => true,
            ]
        );

        $mediaItems = [
            ['file_path' => $eventReunionImg, 'caption' => 'Annual Reunion Banquet Hall, Dhaka', 'order' => 1],
            ['file_path' => $eventSportsImg, 'caption' => 'Inter-College Golf & Family Day Morning', 'order' => 2],
            ['file_path' => $newsLeadershipImg, 'caption' => 'Executive Committee Planning Session', 'order' => 3],
            ['file_path' => $newsWelfareImg, 'caption' => 'Medical & School Supply Outreach Camp', 'order' => 4],
        ];

        foreach ($mediaItems as $item) {
            GalleryMedia::updateOrCreate(
                ['album_id' => $album->id, 'file_path' => $item['file_path']],
                [
                    'media_type' => 'image',
                    'caption' => $item['caption'],
                    'taken_at' => now()->subDays(10)->toDateString(),
                    'display_order' => $item['order'],
                ]
            );
        }

        // 15. Support Tickets
        $ticket1 = SupportTicket::updateOrCreate(
            ['ticket_no' => 'TCK97-0001'],
            [
                'user_id' => $users['alpha@example.test']->id,
                'category' => 'membership',
                'subject' => 'Inquiry regarding digital membership card QR check-in',
                'status' => 'in_progress',
                'priority' => 'medium',
                'assigned_to' => $admin->id,
            ]
        );

        SupportTicketMessage::updateOrCreate(
            ['ticket_id' => $ticket1->id, 'sender_id' => $users['alpha@example.test']->id],
            [
                'message' => 'Hello Admin, how does the QR verification work at upcoming reunion venues?',
                'is_internal_note' => false,
            ]
        );

        SupportTicketMessage::updateOrCreate(
            ['ticket_id' => $ticket1->id, 'sender_id' => $admin->id],
            [
                'message' => 'You can present your digital ID card or event registration QR pass at the entrance desk for instant scan.',
                'is_internal_note' => false,
            ]
        );

        $ticket2 = SupportTicket::updateOrCreate(
            ['ticket_no' => 'TCK97-0002'],
            [
                'user_id' => $users['charlie@example.test']->id,
                'category' => 'verification',
                'subject' => 'Updating MGCC 1997 intake verification document',
                'status' => 'open',
                'priority' => 'high',
                'assigned_to' => $admin->id,
            ]
        );

        SupportTicketMessage::updateOrCreate(
            ['ticket_id' => $ticket2->id, 'sender_id' => $users['charlie@example.test']->id],
            [
                'message' => 'Assalamu Alaikum, I have updated my cadet roll number (#0612). Kindly review my application.',
                'is_internal_note' => false,
            ]
        );

        // 16. Activity, Audit Logs & Notification
        ActivityLog::updateOrCreate(
            ['user_id' => $users['alpha@example.test']->id, 'activity' => 'profile.updated'],
            [
                'member_id' => $memberAlpha->id,
                'subject_type' => 'member',
                'subject_id' => $memberAlpha->id,
            ]
        );

        if (AuditLog::count() === 0) {
            AuditLog::log('member.verified', 'members', $memberAlpha->id, null, ['verification_status' => 'verified']);
            AuditLog::log('event.published', 'events', $eventReunion->id, null, ['status' => 'published']);
        }

        if (DB::table('notifications')->where('notifiable_id', $users['alpha@example.test']->id)->count() === 0) {
            DB::table('notifications')->insert([
                'id' => (string) Str::uuid(),
                'type' => 'App\\Notifications\\MembershipApproved',
                'notifiable_type' => 'App\\Models\\User',
                'notifiable_id' => $users['alpha@example.test']->id,
                'category' => 'membership',
                'data' => json_encode([
                    'message' => 'Congratulations! Your membership for CCINTAKE 97 has been approved and verified.',
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
