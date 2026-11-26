<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class NewsDispatchSeeder extends Seeder
{
    public function run(): void
    {
        $categories = ArticleCategory::pluck('id', 'slug');
        $fallbackCatId = ArticleCategory::value('id');
        $author = User::where('email', 'editor@example.test')->first() ?? User::first();
        $publisher = User::where('email', 'admin@example.test')->first() ?? $author;

        if (! $fallbackCatId || ! $author) {
            return;
        }

        $dispatches = [
            [
                'slug' => 'ccintake97-thirty-year-directory-verification-drive',
                'category_slug' => 'official-announcements',
                'title' => 'Global Batch Directory Verification Drive Reaches All Ten Colleges',
                'excerpt' => 'College representatives across FCC, RCC, MCC, JCC, CCC, SCC, BCC, PCC, MGCC, and FGCC are confirming alumni rolls for the 2027 archive.',
                'body' => '<p>The Central Coordination Committee has launched a synchronized verification drive across all ten constituent cadet colleges of the 1997 intake. Alumni are encouraged to update their current chapter, profession, and emergency coordinates inside the member portal.</p>',
                'days_ago' => 2,
            ],
            [
                'slug' => 'dhaka-secretariat-winter-conclave-2026',
                'category_slug' => 'events-reunions',
                'title' => 'Dhaka Secretariat Concludes Annual Winter Executive Conclave',
                'excerpt' => 'Chapter leads and college coordinators finalized the 2026–2027 calendar for regional musters and welfare disbursements.',
                'body' => '<p>Representatives from domestic and overseas chapters convened in Dhaka to review welfare fund audits, streamline membership approvals, and coordinate upcoming regional gatherings across Europe, North America, and the Middle East.</p>',
                'days_ago' => 5,
            ],
            [
                'slug' => 'fallen-comrades-education-endowment-2026',
                'category_slug' => 'community-activities',
                'title' => 'Education Endowment Supports 18 Children of Departed Batchmates',
                'excerpt' => 'Annual tuition stipends and mentorship pairings were disbursed under the Comrade Welfare Trust for the current academic session.',
                'body' => '<p>Through sustained monthly contributions from 1997 batchmates worldwide, the Comrade Welfare Trust continues to ensure uninterrupted schooling and university support for the families of our departed brothers and sisters.</p>',
                'days_ago' => 9,
            ],
            [
                'slug' => 'intake-97-physicians-telemedicine-desk',
                'category_slug' => 'alumni-achievements',
                'title' => 'Alumni Medical Network Launches 24/7 Tele-Consultation Desk',
                'excerpt' => 'Senior specialists from the 1997 intake have volunteered to provide rapid second opinions and referral guidance for batchmates and parents.',
                'body' => '<p>Over forty specialist physicians and surgeons from the class of 1997 have joined the centralized medical referral roster, offering priority guidance for members and their immediate families during medical emergencies.</p>',
                'days_ago' => 12,
            ],
            [
                'slug' => 'north-america-chapter-autumn-muster',
                'category_slug' => 'events-reunions',
                'title' => 'North America Chapter Hosts Autumn Muster in Toronto & New Jersey',
                'excerpt' => 'More than seventy batchmates and families gathered for an evening of cadet mess traditions and fellowship.',
                'body' => '<p>Batchmates residing across Canada and the United States reunited for two parallel chapter dinners, raising fresh pledges for the emergency medical reserve and onboarding newly relocated cadets.</p>',
                'days_ago' => 18,
            ],
            [
                'slug' => 'inter-college-97-cricket-cup-announcement',
                'category_slug' => 'community-activities',
                'title' => 'Inter-College ’97 Cricket & Golf Invitational Fixtures Announced',
                'excerpt' => 'Registration is now open for college-wise squads ahead of the winter sporting weekend at Kurmitola and Army Stadium grounds.',
                'body' => '<p>Team captains from all ten colleges are finalizing their rosters for the annual friendly tournament, celebrating sportsmanship and camaraderie nearly three decades after our Class 7 induction.</p>',
                'days_ago' => 23,
            ],
            [
                'slug' => 'maritime-and-aviation-leadership-honors',
                'category_slug' => 'alumni-achievements',
                'title' => 'Batchmates Recognized for National Aviation & Maritime Milestones',
                'excerpt' => 'Several 1997 alumni received commendations for excellence in civil aviation safety, naval engineering, and port logistics.',
                'body' => '<p>CCINTAKE 97 congratulates our batchmates whose leadership in critical national infrastructure and international operations continues to uphold the highest traditions of our alma maters.</p>',
                'days_ago' => 29,
            ],
            [
                'slug' => 'passkey-security-upgrade-member-portal',
                'category_slug' => 'important-notices',
                'title' => 'Member Portal Now Supports Passwordless Passkey Sign-In',
                'excerpt' => 'Verified alumni can now enable biometric passkeys and two-factor protection from their account security settings.',
                'body' => '<p>To safeguard private contact details inside the batch directory, the portal now supports hardware-backed passkeys alongside traditional two-factor authentication.</p>',
                'days_ago' => 35,
            ],
            [
                'slug' => 'remembrance-archive-class-of-1997',
                'category_slug' => 'member-stories',
                'title' => 'In Memoriam Archive: Preserving Stories of Our Departed Comrades',
                'excerpt' => 'Housemates and college friends share photographs, cadet anecdotes, and tributes for the permanent 30th-year memorial volume.',
                'body' => '<p>The Editorial Board invites classmates to submit verified memories and photographs of departed batchmates so their legacy remains honored in our permanent digital and print archive.</p>',
                'days_ago' => 42,
            ],
        ];

        foreach ($dispatches as $item) {
            Article::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'category_id' => $categories[$item['category_slug']] ?? $fallbackCatId,
                    'title' => $item['title'],
                    'excerpt' => $item['excerpt'],
                    'body' => $item['body'],
                    'cover_image_path' => null,
                    'author_id' => $author->id,
                    'status' => 'published',
                    'published_by' => $publisher->id,
                    'published_at' => now()->subDays($item['days_ago']),
                ]
            );
        }
    }
}
