<?php

namespace Tests\Feature;

use App\Models\College;
use App\Models\User;
use Database\Seeders\ReferenceDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CollegeLogoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ReferenceDataSeeder::class);
        Storage::fake('public');
    }

    private function admin(): User
    {
        $admin = User::factory()->create(['account_status' => 'active']);
        $admin->assignRole('association_admin');

        return $admin;
    }

    public function test_admin_can_upload_replace_and_remove_college_logo(): void
    {
        $college = College::where('short_name', 'FCC')->first();
        $admin = $this->admin();

        $this->actingAs($admin)
            ->post("/admin/colleges/{$college->id}/logo", ['logo' => UploadedFile::fake()->image('fcc.png', 256, 256)])
            ->assertRedirect();

        $first = $college->fresh()->logo_path;
        $this->assertNotNull($first);
        Storage::disk('public')->assertExists($first);
        $this->assertStringEndsWith('/storage/'.$first, (string) $college->fresh()->logo_url);

        $this->actingAs($admin)
            ->post("/admin/colleges/{$college->id}/logo", ['logo' => UploadedFile::fake()->image('fcc2.webp', 256, 256)])
            ->assertRedirect();

        $second = $college->fresh()->logo_path;
        $this->assertNotSame($first, $second);
        Storage::disk('public')->assertMissing($first);

        $this->actingAs($admin)->delete("/admin/colleges/{$college->id}/logo")->assertRedirect();

        $this->assertNull($college->fresh()->logo_path);
        Storage::disk('public')->assertMissing($second);
    }

    public function test_logo_upload_rejects_svg_and_non_images(): void
    {
        $college = College::where('short_name', 'MCC')->first();
        $before = $college->logo_path;

        $this->actingAs($this->admin())
            ->post("/admin/colleges/{$college->id}/logo", [
                'logo' => UploadedFile::fake()->createWithContent('crest.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'),
            ])
            ->assertSessionHasErrors('logo');

        $this->assertSame($before, $college->fresh()->logo_path);
    }

    public function test_regular_member_cannot_upload_logo(): void
    {
        $college = College::where('short_name', 'RCC')->first();
        $user = User::factory()->create(['account_status' => 'active']);
        $user->assignRole('regular_member');

        $this->actingAs($user)
            ->post("/admin/colleges/{$college->id}/logo", ['logo' => UploadedFile::fake()->image('x.png')])
            ->assertForbidden();
    }
}
