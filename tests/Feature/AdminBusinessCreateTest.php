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
            ->assertRedirect('/admin/businesses');

        $biz = Business::where('name', 'Apex Logistics')->firstOrFail();
        $this->assertSame($owner->id, $biz->owner_member_id);
        $this->assertSame('approved', $biz->status);
        $this->assertSame('BD', $biz->country_code);
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

    public function test_admin_can_open_pages_and_edit_business(): void
    {
        $admin = User::factory()->create(['account_status' => 'active']);
        $admin->assignRole('association_admin');
        $owner = $this->owner();

        $this->actingAs($admin)->get('/admin/businesses/create')->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/businesses/form')->where('business', null)->has('owners', 1));

        $this->actingAs($admin)->post('/admin/businesses', $this->payload($owner, [
            'status' => 'pending',
            'logo' => UploadedFile::fake()->image('old.png'),
        ]));
        $biz = Business::where('name', 'Apex Logistics')->firstOrFail();
        $oldLogo = $biz->logo_path;
        $this->assertNull($biz->verified_at);

        $this->actingAs($admin)->get("/admin/businesses/{$biz->id}/edit")->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/businesses/form')->where('business.name', 'Apex Logistics'));

        // Edits are sent as POST with _method=put so the logo file can be uploaded.
        $this->actingAs($admin)->post("/admin/businesses/{$biz->id}", $this->payload($owner, [
            '_method' => 'put',
            'name' => 'Apex Global Logistics',
            'status' => 'approved',
            'logo' => UploadedFile::fake()->image('new.png'),
        ]))->assertSessionHasNoErrors()->assertRedirect('/admin/businesses');

        $biz->refresh();
        $this->assertSame('Apex Global Logistics', $biz->name);
        $this->assertSame('approved', $biz->status);
        $this->assertNotNull($biz->verified_at);
        $this->assertNotSame($oldLogo, $biz->logo_path);
        Storage::disk('public')->assertMissing($oldLogo);

        $this->actingAs($admin)->put("/admin/businesses/{$biz->id}", $this->payload($owner, ['remove_logo' => true]))->assertSessionHasNoErrors();
        $this->assertNull($biz->fresh()->logo_path);
    }
}
