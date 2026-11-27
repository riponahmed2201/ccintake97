<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\BusinessCategory;
use App\Models\College;
use App\Models\Industry;
use App\Models\Member;
use App\Models\User;
use Database\Seeders\ReferenceDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminBusinessCreateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ReferenceDataSeeder::class);
        Storage::fake('public');
    }

    private function owner(): Member
    {
        $user = User::factory()->create(['account_status' => 'active']);

        return Member::create([
            'user_id' => $user->id,
            'college_id' => College::where('short_name', 'FCC')->value('id'),
            'college_roll_no' => '1001',
            'intake_year' => 1997,
            'membership_status' => 'approved',
            'verification_status' => 'verified',
        ]);
    }

    private function payload(Member $owner, array $overrides = []): array
    {
        return array_merge([
            'owner_member_id' => $owner->id,
            'name' => 'Apex Logistics',
            'category_id' => BusinessCategory::value('id'),
            'industry_id' => Industry::value('id'),
            'description' => 'Freight and supply chain.',
            'website' => 'https://apex.example.com',
            'city' => 'Chattogram',
            'country_code' => 'bd',
            'status' => 'approved',
            'is_featured' => true,
        ], $overrides);
    }

    public function test_admin_can_add_business_with_logo(): void
    {
        $admin = User::factory()->create(['account_status' => 'active']);
        $admin->assignRole('association_admin');
        $owner = $this->owner();

        $this->actingAs($admin)
            ->post('/admin/businesses', $this->payload($owner, ['logo' => UploadedFile::fake()->image('logo.png', 200, 200)]))
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $biz = Business::where('name', 'Apex Logistics')->firstOrFail();
        $this->assertSame($owner->id, $biz->owner_member_id);
        $this->assertSame('approved', $biz->status);
        $this->assertSame('BD', $biz->country_code);
        $this->assertTrue((bool) $biz->is_featured);
        $this->assertNotNull($biz->verified_at);
        Storage::disk('public')->assertExists($biz->logo_path);
    }

    public function test_validation_and_authorization(): void
    {
        $admin = User::factory()->create(['account_status' => 'active']);
        $admin->assignRole('association_admin');
        $owner = $this->owner();

        $this->actingAs($admin)
            ->post('/admin/businesses', $this->payload($owner, ['name' => '', 'website' => 'not-a-url']))
            ->assertSessionHasErrors(['name', 'website']);

        $member = User::factory()->create(['account_status' => 'active']);
        $member->assignRole('regular_member');
        $this->actingAs($member)->post('/admin/businesses', $this->payload($owner))->assertForbidden();

        $this->assertSame(0, Business::where('name', 'Apex Logistics')->count());
    }
}
