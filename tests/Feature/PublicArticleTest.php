<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\User;
use Database\Seeders\ReferenceDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicArticleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ReferenceDataSeeder::class);
    }

    public function test_published_article_is_visible_on_public_news_route(): void
    {
        $author = User::factory()->create();
        $category = ArticleCategory::first();

        $article = Article::create([
            'category_id' => $category->id,
            'title' => 'Public Gazette Item',
            'slug' => 'public-gazette-item',
            'excerpt' => 'Short excerpt.',
            'body' => '<p>Body text.</p>',
            'author_id' => $author->id,
            'status' => 'published',
            'published_at' => now()->subHour(),
        ]);

        $this->get('/news/'.$article->slug)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('news/show')
                ->where('article.slug', 'public-gazette-item')
            );
    }

    public function test_unpublished_article_returns_not_found(): void
    {
        $author = User::factory()->create();
        $category = ArticleCategory::first();

        Article::create([
            'category_id' => $category->id,
            'title' => 'Draft Only',
            'slug' => 'draft-only',
            'body' => '<p>Nope.</p>',
            'author_id' => $author->id,
            'status' => 'draft',
        ]);

        $this->get('/news/draft-only')->assertNotFound();
    }
}