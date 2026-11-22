<?php

namespace Database\Seeders;

use App\Models\ArticleCategory;
use App\Models\BusinessCategory;
use App\Models\College;
use App\Models\EventCategory;
use App\Models\Industry;
use App\Models\SystemSetting;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class ReferenceDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Colleges
        $colleges = [
            ['name' => 'Faujdarhat Cadet College', 'short_name' => 'FCC', 'slug' => 'faujdarhat-cadet-college', 'website' => 'https://fcc.army.mil.bd', 'established_year' => 1958, 'location' => 'Chattogram', 'is_participating' => true, 'display_order' => 1],
            ['name' => 'Mirzapur Cadet College', 'short_name' => 'MCC', 'slug' => 'mirzapur-cadet-college', 'website' => 'https://mcc.army.mil.bd', 'established_year' => 1963, 'location' => 'Tangail', 'is_participating' => true, 'display_order' => 2],
            ['name' => 'Rajshahi Cadet College', 'short_name' => 'RCC', 'slug' => 'rajshahi-cadet-college', 'website' => 'https://rcc.army.mil.bd', 'established_year' => 1966, 'location' => 'Rajshahi', 'is_participating' => true, 'display_order' => 3],
            ['name' => 'Jhenaidah Cadet College', 'short_name' => 'JCC', 'slug' => 'jhenaidah-cadet-college', 'website' => 'https://jcc.army.mil.bd', 'established_year' => 1963, 'location' => 'Jhenaidah', 'is_participating' => true, 'display_order' => 4],
            ['name' => 'Sylhet Cadet College', 'short_name' => 'SCC', 'slug' => 'sylhet-cadet-college', 'website' => 'https://scc.army.mil.bd', 'established_year' => 1978, 'location' => 'Sylhet', 'is_participating' => true, 'display_order' => 5],
            ['name' => 'Rangpur Cadet College', 'short_name' => 'CCR', 'slug' => 'rangpur-cadet-college', 'website' => 'https://ccr.army.mil.bd', 'established_year' => 1979, 'location' => 'Rangpur', 'is_participating' => true, 'display_order' => 6],
            ['name' => 'Barishal Cadet College', 'short_name' => 'BCC', 'slug' => 'barishal-cadet-college', 'website' => 'https://bcc.army.mil.bd', 'established_year' => 1981, 'location' => 'Barishal', 'is_participating' => true, 'display_order' => 7],
            ['name' => 'Pabna Cadet College', 'short_name' => 'PCC', 'slug' => 'pabna-cadet-college', 'website' => 'https://pcc.army.mil.bd', 'established_year' => 1981, 'location' => 'Pabna', 'is_participating' => true, 'display_order' => 8],
            ['name' => 'Mymensingh Girls Cadet College', 'short_name' => 'MGCC', 'slug' => 'mymensingh-girls-cadet-college', 'website' => 'https://mgcc.army.mil.bd', 'established_year' => 1982, 'location' => 'Mymensingh', 'is_participating' => true, 'display_order' => 9],
            ['name' => 'Cumilla Cadet College', 'short_name' => 'CCC', 'slug' => 'cumilla-cadet-college', 'website' => 'https://ccc.army.mil.bd', 'established_year' => 1983, 'location' => 'Cumilla', 'is_participating' => true, 'display_order' => 10],
            ['name' => 'Feni Girls Cadet College', 'short_name' => 'FGCC', 'slug' => 'feni-girls-cadet-college', 'website' => 'https://fgcc.army.mil.bd', 'established_year' => 2006, 'location' => 'Feni', 'is_participating' => false, 'display_order' => 11],
            ['name' => 'Joypurhat Girls Cadet College', 'short_name' => 'JGCC', 'slug' => 'joypurhat-girls-cadet-college', 'website' => 'https://jgcc.army.mil.bd', 'established_year' => 2006, 'location' => 'Joypurhat', 'is_participating' => false, 'display_order' => 12],
        ];

        foreach ($colleges as $c) {
            College::updateOrCreate(['slug' => $c['slug']], $c);
        }

        // 2. Industries
        $industries = [
            ['name' => 'Information Technology & Software', 'slug' => 'information-technology', 'display_order' => 1],
            ['name' => 'Engineering & Construction', 'slug' => 'engineering-construction', 'display_order' => 2],
            ['name' => 'Healthcare & Medicine', 'slug' => 'healthcare-medicine', 'display_order' => 3],
            ['name' => 'Banking, Finance & Fintech', 'slug' => 'banking-finance', 'display_order' => 4],
            ['name' => 'Defense & Armed Forces', 'slug' => 'defense-military', 'display_order' => 5],
            ['name' => 'Civil Service & Governance', 'slug' => 'civil-service', 'display_order' => 6],
            ['name' => 'Education & Academic Research', 'slug' => 'education-academia', 'display_order' => 7],
            ['name' => 'Telecommunications & Networks', 'slug' => 'telecommunications', 'display_order' => 8],
            ['name' => 'Textile, Apparel & Manufacturing', 'slug' => 'textile-apparel', 'display_order' => 9],
            ['name' => 'Legal, Corporate Law & Judiciary', 'slug' => 'legal-judiciary', 'display_order' => 10],
            ['name' => 'Media, Marketing & Creative Arts', 'slug' => 'media-arts', 'display_order' => 11],
            ['name' => 'Entrepreneurship & Global Trade', 'slug' => 'entrepreneurship-trade', 'display_order' => 12],
        ];

        foreach ($industries as $ind) {
            Industry::updateOrCreate(['slug' => $ind['slug']], $ind);
        }

        // 3. Event Categories
        $eventCategories = [
            ['name' => 'Annual Reunion', 'slug' => 'annual-reunion', 'display_order' => 1],
            ['name' => 'National Alumni Gathering', 'slug' => 'national-gathering', 'display_order' => 2],
            ['name' => 'College-based Gathering', 'slug' => 'college-gathering', 'display_order' => 3],
            ['name' => 'Family Event', 'slug' => 'family-event', 'display_order' => 4],
            ['name' => 'Professional Networking', 'slug' => 'professional-networking', 'display_order' => 5],
            ['name' => 'Seminar & Workshop', 'slug' => 'seminar-workshop', 'display_order' => 6],
            ['name' => 'Sports & Recreation', 'slug' => 'sports-recreation', 'display_order' => 7],
            ['name' => 'Community Welfare', 'slug' => 'community-welfare', 'display_order' => 8],
            ['name' => 'Other Events', 'slug' => 'other-events', 'display_order' => 9],
        ];

        foreach ($eventCategories as $ec) {
            EventCategory::updateOrCreate(['slug' => $ec['slug']], $ec);
        }

        // 4. Article Categories
        $articleCategories = [
            ['name' => 'Association News', 'slug' => 'association-news', 'display_order' => 1],
            ['name' => 'Official Announcements', 'slug' => 'official-announcements', 'display_order' => 2],
            ['name' => 'Alumni Achievements', 'slug' => 'alumni-achievements', 'display_order' => 3],
            ['name' => 'Member Stories', 'slug' => 'member-stories', 'display_order' => 4],
            ['name' => 'Events & Reunions', 'slug' => 'events-reunions', 'display_order' => 5],
            ['name' => 'Community Activities', 'slug' => 'community-activities', 'display_order' => 6],
            ['name' => 'Important Notices', 'slug' => 'important-notices', 'display_order' => 7],
        ];

        foreach ($articleCategories as $ac) {
            ArticleCategory::updateOrCreate(['slug' => $ac['slug']], $ac);
        }

        // 5. Business Categories
        $businessCategories = [
            ['name' => 'Technology & Software', 'slug' => 'technology-software', 'display_order' => 1],
            ['name' => 'Financial & Advisory Services', 'slug' => 'financial-advisory', 'display_order' => 2],
            ['name' => 'Healthcare & Diagnostics', 'slug' => 'healthcare-diagnostics', 'display_order' => 3],
            ['name' => 'Construction & Real Estate', 'slug' => 'construction-real-estate', 'display_order' => 4],
            ['name' => 'Retail & E-commerce', 'slug' => 'retail-ecommerce', 'display_order' => 5],
            ['name' => 'Legal & Consultancy', 'slug' => 'legal-consultancy', 'display_order' => 6],
            ['name' => 'Manufacturing & Supply Chain', 'slug' => 'manufacturing-supply-chain', 'display_order' => 7],
            ['name' => 'Hospitality & Tourism', 'slug' => 'hospitality-tourism', 'display_order' => 8],
        ];

        foreach ($businessCategories as $bc) {
            BusinessCategory::updateOrCreate(['slug' => $bc['slug']], $bc);
        }

        // 6. Permissions & Roles
        $permissions = [
            'admin.access',
            'members.view_all',
            'members.create',
            'members.edit',
            'members.approve',
            'members.verify',
            'members.suspend',
            'members.archive',
            'members.export',
            'applications.view',
            'applications.review',
            'applications.decide',
            'colleges.manage',
            'committees.manage',
            'events.view',
            'events.manage',
            'events.publish',
            'events.checkin',
            'events.export',
            'articles.view',
            'articles.create',
            'articles.edit',
            'articles.publish',
            'gallery.manage',
            'gallery.review_submissions',
            'businesses.view',
            'businesses.moderate',
            'businesses.verify',
            'initiatives.manage',
            'documents.manage',
            'documents.view_confidential',
            'tickets.manage',
            'tickets.reply',
            'notifications.broadcast',
            'roles.manage',
            'settings.manage',
            'reports.view',
            'reports.export',
            'audit.view',
            'directory.browse',
            'connections.manage',
            'mentorship.participate',
        ];

        foreach ($permissions as $p) {
            Permission::findOrCreate($p, 'web');
        }

        $superAdmin = Role::findOrCreate('super_admin', 'web');
        $superAdmin->givePermissionTo(Permission::all());

        $assocAdmin = Role::findOrCreate('association_admin', 'web');
        $assocAdmin->givePermissionTo([
            'admin.access', 'members.view_all', 'members.create', 'members.edit', 'members.approve', 'members.verify', 'members.suspend', 'members.archive', 'members.export',
            'applications.view', 'applications.review', 'applications.decide', 'colleges.manage', 'committees.manage',
            'events.view', 'events.manage', 'events.publish', 'events.checkin', 'events.export',
            'articles.view', 'articles.create', 'articles.edit', 'articles.publish', 'gallery.manage', 'gallery.review_submissions',
            'businesses.view', 'businesses.moderate', 'businesses.verify', 'initiatives.manage', 'documents.manage', 'documents.view_confidential',
            'tickets.manage', 'tickets.reply', 'notifications.broadcast', 'reports.view', 'reports.export', 'audit.view', 'directory.browse'
        ]);

        $membershipManager = Role::findOrCreate('membership_manager', 'web');
        $membershipManager->givePermissionTo([
            'admin.access', 'members.view_all', 'members.create', 'members.edit', 'members.approve', 'members.verify', 'members.suspend', 'members.export',
            'applications.view', 'applications.review', 'applications.decide', 'directory.browse', 'reports.view'
        ]);

        $membershipReviewer = Role::findOrCreate('membership_reviewer', 'web');
        $membershipReviewer->givePermissionTo([
            'admin.access', 'members.view_all', 'applications.view', 'applications.review', 'directory.browse'
        ]);

        $eventManager = Role::findOrCreate('event_manager', 'web');
        $eventManager->givePermissionTo([
            'admin.access', 'events.view', 'events.manage', 'events.publish', 'events.checkin', 'events.export', 'directory.browse'
        ]);

        $contentEditor = Role::findOrCreate('content_editor', 'web');
        $contentEditor->givePermissionTo([
            'admin.access', 'articles.view', 'articles.create', 'articles.edit', 'directory.browse'
        ]);

        $contentPublisher = Role::findOrCreate('content_publisher', 'web');
        $contentPublisher->givePermissionTo([
            'admin.access', 'articles.view', 'articles.create', 'articles.edit', 'articles.publish', 'gallery.manage', 'gallery.review_submissions', 'directory.browse'
        ]);

        $verifiedMember = Role::findOrCreate('verified_member', 'web');
        $verifiedMember->givePermissionTo([
            'directory.browse', 'connections.manage', 'mentorship.participate'
        ]);

        Role::findOrCreate('regular_member', 'web');
        Role::findOrCreate('finance_manager', 'web');
        Role::findOrCreate('committee_manager', 'web');
        Role::findOrCreate('gallery_manager', 'web');
        Role::findOrCreate('moderator', 'web');

        // 7. System Settings
        $settings = [
            ['key' => 'site_name', 'value' => 'INTAKE97.COM', 'group' => 'general'],
            ['key' => 'site_tagline', 'value' => 'Cadet College 1997 Intake Alumni Community of Bangladesh', 'group' => 'general'],
            ['key' => 'contact_email', 'value' => 'contact@intake97.com', 'group' => 'general'],
            ['key' => 'contact_phone', 'value' => '+880 1711 000097', 'group' => 'general'],
            ['key' => 'office_address', 'value' => 'Intake 97 Secretariat, Dhaka, Bangladesh', 'group' => 'general'],
            ['key' => 'registration_open', 'value' => 'true', 'group' => 'system'],
            ['key' => 'timezone', 'value' => 'Asia/Dhaka', 'group' => 'system'],
        ];

        foreach ($settings as $s) {
            SystemSetting::set($s['key'], $s['value'], $s['group']);
        }
    }
}
