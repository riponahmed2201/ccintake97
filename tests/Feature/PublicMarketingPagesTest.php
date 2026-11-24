<?php

namespace Tests\Feature;

use Database\Seeders\ReferenceDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicMarketingPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ReferenceDataSeeder::class);
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('marketingRoutes')]
    public function test_marketing_pages_render(string $uri, string $page): void
    {
        $this->get($uri)
            ->assertOk()
            ->assertInertia(fn (Assert $assert) => $assert
                ->component('public/marketing')
                ->where('page', $page)
            );
    }

    public static function marketingRoutes(): array
    {
        return [
            ['/about', 'about'],
            ['/colleges', 'colleges'],
            ['/committee', 'committee'],
            ['/welfare', 'welfare'],
            ['/contact', 'contact'],
        ];
    }
}