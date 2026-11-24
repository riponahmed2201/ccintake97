<?php

namespace Tests\Feature;

use App\Models\College;
use App\Models\Member;
use App\Models\MembershipApplication;
use App\Models\User;
use Database\Seeders\ReferenceDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MemberProfileDetailsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ReferenceDataSeeder::class);
    }

    public function test_member_can_save_structured_profile_details(): void
    {
        Storage::fake('public');

        $ccr = College::where('short_name', 'CCR')->first();

        $this->post('/register-alumni', [
            'name' => 'Karim Chowdhury',
            'email' => 'karim.97@example.com',
            'password' => 'SecurePass97!',
            'password_confirmation' => 'SecurePass97!',
        ])->assertRedirect('/member/dashboard');

        $user = User::where('email', 'karim.97@example.com')->first();

        $response = $this->actingAs($user)->put('/member/profile', [
            'name' => 'Karim Chowdhury',
            'cadet_name' => 'Karim',
            'phone' => '+8801711000197',
            'blood_group' => 'B+',
            'spouse_name' => 'Nabila Karim',
            'spouse_occupation' => 'Teacher',
            'spouse_job_location' => 'Rangpur',
            'children_names' => ['Ayaan', '', 'Zara'],
            'address' => 'House 4, Rangpur',
            'college_id' => $ccr->id,
            'college_roll_no' => '441',
            'intake_year' => 1997,
            'house_name' => 'Teesta',
            'house_color' => 'Green',
            'job_type' => 'Engineer',
            'organization' => 'Northern Grid',
            'designation' => 'Executive Engineer',
            'office_address' => 'Station Road, Rangpur',
            'office_phone' => '+8801711000198',
            'facebook_url' => 'https://facebook.com/karim.97',
            'linkedin_url' => 'https://linkedin.com/in/karim97',
            'remarks' => 'Prefers evening calls.',
            'photo' => UploadedFile::fake()->image('cadet.jpg')->size(400),
        ]);

        $response->assertSessionHas('success');

        $member = Member::where('user_id', $user->id)->first();
        $this->assertSame($ccr->id, $member->college_id);
        $this->assertSame('441', $member->college_roll_no);
        $this->assertSame(1997, $member->intake_year);
        $this->assertSame('Teesta', $member->house_name);
        $this->assertSame('Green', $member->house_color);

        $profile = $member->profile;
        $this->assertSame('Karim', $profile->cadet_name);
        $this->assertSame('B+', $profile->blood_group);
        $this->assertSame('Nabila Karim', $profile->spouse_name);
        $this->assertSame('Teacher', $profile->spouse_occupation);
        $this->assertSame('Rangpur', $profile->spouse_job_location);
        $this->assertSame(['Ayaan', 'Zara'], $profile->children_names);
        $this->assertSame('Engineer', $profile->job_type);
        $this->assertSame('Station Road, Rangpur', $profile->office_address);
        $this->assertSame('Prefers evening calls.', $profile->remarks);

        $user->refresh();
        $this->assertNotNull($user->avatar_path);
        Storage::disk('public')->assertExists($user->avatar_path);

        $application = MembershipApplication::where('member_id', $member->id)->first();
        $this->assertNotNull($application);
        $this->assertSame('submitted', $application->status);
        $this->assertSame($ccr->id, $application->declared_college_id);
    }

    public function test_profile_rejects_a_free_typed_job_and_an_oversized_photo(): void
    {
        $fcc = College::where('short_name', 'FCC')->first();

        $this->post('/register-alumni', [
            'name' => 'Nabil Hasan',
            'email' => 'nabil.97@example.com',
            'password' => 'SecurePass97!',
            'password_confirmation' => 'SecurePass97!',
        ]);

        $user = User::where('email', 'nabil.97@example.com')->first();

        $this->actingAs($user)->put('/member/profile', [
            'name' => 'Nabil Hasan',
            'phone' => '+8801711000297',
            'college_id' => $fcc->id,
            'college_roll_no' => '210',
            'intake_year' => 1997,
            'job_type' => 'Software ninja',
            'photo' => UploadedFile::fake()->image('huge.jpg')->size(6000),
        ])->assertSessionHasErrors(['job_type', 'photo']);
    }
}
