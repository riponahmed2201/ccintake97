<?php

namespace Tests\Feature;

use Database\Seeders\ReferenceDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicHomeTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ReferenceDataSeeder::class);
    }

    public function test_home_renders_welcome_with_metrics_and_events(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('welcome')
                ->has('metrics', fn (Assert $m) => $m
                    ->has('total_members')
                    ->has('verified_members')
                    ->has('total_colleges')
                    ->where('intake_year', 1997)
                )
                ->has('events')
                ->has('colleges')
            );
    }
}