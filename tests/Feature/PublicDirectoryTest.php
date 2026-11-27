<?php

namespace Tests\Feature;

use App\Models\College;
use App\Models\Member;
use App\Models\MemberPrivacySetting;
use App\Models\MemberProfile;
use App\Models\User;
use Database\Seeders\ReferenceDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicDirectoryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ReferenceDataSeeder::class);
    }

    private function makeMember(string $name, string $college, array $overrides = [], array $profile = [], array $privacy = []): Member
    {
        $user = User::factory()->create([
            'name' => $name,
            'phone' => '+8801711000000',
            'avatar_path' => 'avatars/'.str()->slug($name).'.jpg',
        ]);
        $member = Member::create(array_merge([
            'user_id' => $user->id,
            'college_id' => College::where('short_name', $college)->value('id'),
            'college_roll_no' => (string) random_int(1000, 9999),
            'intake_year' => 1997,
            'membership_status' => 'approved',
            'verification_status' => 'verified',
            'verified_at' => now(),
        ], $overrides));
        MemberProfile::create(array_merge([
            'member_id' => $member->id,
            'country_code' => 'BD',
            'designation' => 'Consultant Surgeon',
            'organization' => 'Square Hospital',
            'city' => 'Dhaka',
        ], $profile));
        foreach (array_merge(['photo' => 'verified_members', 'designation' => 'verified_members', 'organization' => 'verified_members', 'city' => 'connections'], $privacy) as $key => $visibility) {
            MemberPrivacySetting::create(['member_id' => $member->id, 'field_key' => $key, 'visibility' => $visibility]);
        }

        return $member;
    }

    public function test_guest_sees_only_verified_approved_members(): void
    {
        $this->makeMember('Visible Verified', 'FCC');
        $this->makeMember('Pending Person', 'MCC', ['membership_status' => 'pending', 'verification_status' => 'unverified']);
        $this->makeMember('Suspended Person', 'RCC', ['membership_status' => 'suspended']);

        $this->get('/directory')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('directory/public')
                ->has('members.data', 1)
                ->where('members.data.0.name', 'Visible Verified')
                ->where('total', 1));
    }

    public function test_private_fields_are_hidden_and_contact_details_never_sent(): void
    {
        $this->makeMember('Private Pat', 'FCC');

        $response = $this->get('/directory')->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('members.data.0.name', 'Private Pat')
            ->where('members.data.0.photo_url', null)
            ->where('members.data.0.designation', null)
            ->where('members.data.0.organization', null)
            ->where('members.data.0.city', null)
            ->missing('members.data.0.email')
            ->missing('members.data.0.phone'));

        $html = $response->getContent();
        $this->assertStringNotContainsString('+8801711000000', $html);
        $this->assertStringNotContainsString('Square Hospital', $html);
        $this->assertStringNotContainsString('private-pat.jpg', $html);
    }

    public function test_public_fields_are_shown_when_member_opts_in(): void
    {
        $this->makeMember('Open Olivia', 'MGCC', [], [], ['photo' => 'public', 'designation' => 'public', 'city' => 'public']);

        $this->get('/directory')->assertInertia(fn (Assert $page) => $page
            ->where('members.data.0.photo_url', fn ($url) => str_ends_with((string) $url, '/storage/avatars/open-olivia.jpg'))
            ->where('members.data.0.designation', 'Consultant Surgeon')
            ->where('members.data.0.organization', null)
            ->where('members.data.0.city', 'Dhaka'));
    }

    public function test_search_by_name_and_college_filter(): void
    {
        $this->makeMember('Tariq Hasan', 'FCC');
        $this->makeMember('Navid Huq', 'MCC');

        $this->get('/directory?search=tariq')->assertInertia(fn (Assert $page) => $page
            ->has('members.data', 1)->where('members.data.0.name', 'Tariq Hasan'));

        $mcc = College::where('short_name', 'MCC')->value('id');
        $this->get("/directory?college_id={$mcc}")->assertInertia(fn (Assert $page) => $page
            ->has('members.data', 1)->where('members.data.0.name', 'Navid Huq'));
    }

    public function test_profession_and_city_search_cannot_reveal_hidden_details(): void
    {
        $this->makeMember('Hidden Surgeon', 'FCC');
        $this->makeMember('Public Surgeon', 'MCC', [], [], ['designation' => 'public', 'city' => 'public']);

        $this->get('/directory?search=surgeon&field=profession')->assertInertia(fn (Assert $page) => $page
            ->has('members.data', 1)->where('members.data.0.name', 'Public Surgeon'));

        $this->get('/directory?search=dhaka&field=city')->assertInertia(fn (Assert $page) => $page
            ->has('members.data', 1)->where('members.data.0.name', 'Public Surgeon'));
    }

    public function test_invalid_filters_are_rejected(): void
    {
        $this->get('/directory?field=email&search=x')->assertSessionHasErrors('field');
    }
}
