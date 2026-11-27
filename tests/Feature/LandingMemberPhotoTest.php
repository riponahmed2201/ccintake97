<?php

namespace Tests\Feature;

use App\Models\College;
use App\Models\Committee;
use App\Models\CommitteeMember;
use App\Models\Member;
use App\Models\MemberPrivacySetting;
use App\Models\MemberProfile;
use App\Models\User;
use Database\Seeders\ReferenceDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LandingMemberPhotoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ReferenceDataSeeder::class);
        Storage::fake('public');
    }

    private function verifiedMember(string $name, string $photoVisibility): Member
    {
        $user = User::factory()->create(['name' => $name, 'account_status' => 'active']);
        $user->assignRole('regular_member');
        $member = Member::create([
            'user_id' => $user->id,
            'college_id' => College::where('short_name', 'FCC')->value('id'),
            'college_roll_no' => (string) random_int(1000, 9999),
            'intake_year' => 1997,
            'membership_status' => 'approved',
            'verification_status' => 'verified',
            'verified_at' => now(),
        ]);
        MemberProfile::create(['member_id' => $member->id, 'country_code' => 'BD']);
        MemberPrivacySetting::create(['member_id' => $member->id, 'field_key' => 'photo', 'visibility' => $photoVisibility]);

        return $member;
    }

    public function test_photo_uploaded_by_member_appears_on_landing_when_public(): void
    {
        $member = $this->verifiedMember('Photo Public', 'public');

        $this->actingAs($member->user)
            ->post('/member/profile/photo', ['photo' => UploadedFile::fake()->image('me.jpg', 600, 600)])
            ->assertSessionHasNoErrors();

        $path = $member->user->fresh()->avatar_path;
        $this->assertNotNull($path);
        Storage::disk('public')->assertExists($path);

        $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('directoryPreview.0.name', 'Photo Public')
            ->where('directoryPreview.0.photo_url', fn ($url) => str_ends_with((string) $url, '/storage/'.$path)));

        // A replacement photo gets a new URL, so browsers never show the stale one.
        $this->actingAs($member->user)->post('/member/profile/photo', ['photo' => UploadedFile::fake()->image('new.jpg', 600, 600)]);
        $newPath = $member->user->fresh()->avatar_path;
        $this->assertNotSame($path, $newPath);
        Storage::disk('public')->assertMissing($path);
        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('directoryPreview.0.photo_url', fn ($url) => str_ends_with((string) $url, '/storage/'.$newPath)));
    }

    public function test_photo_stays_hidden_until_member_makes_it_public(): void
    {
        $member = $this->verifiedMember('Photo Private', 'verified_members');
        $this->actingAs($member->user)->post('/member/profile/photo', ['photo' => UploadedFile::fake()->image('me.jpg')]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('directoryPreview.0.photo_url', null));

        $this->actingAs($member->user)
            ->put('/member/privacy', ['settings' => ['photo' => 'public']])
            ->assertSessionHasNoErrors();

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->where('directoryPreview.0.photo_url', fn ($url) => str_ends_with((string) $url, '/storage/'.$member->user->fresh()->avatar_path)));
    }

    public function test_committee_member_photo_shows_on_landing(): void
    {
        $member = $this->verifiedMember('Council President', 'verified_members');
        $this->actingAs($member->user)->post('/member/profile/photo', ['photo' => UploadedFile::fake()->image('me.jpg')]);

        $committee = Committee::create(['name' => 'Central Executive Committee (2025-2027)', 'slug' => 'cec-2025', 'status' => 'active', 'display_order' => 1]);
        CommitteeMember::create(['committee_id' => $committee->id, 'member_id' => $member->id, 'position_title' => 'President', 'display_order' => 1]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->where('committee.members.0.member.user.avatar_path', $member->user->fresh()->avatar_path));
    }
}
