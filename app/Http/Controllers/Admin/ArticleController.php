<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\AuditLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $articles = Article::with(['category', 'author', 'publisher'])
            ->latest()
            ->paginate(10);

        return Inertia::render('admin/articles/index', [
            'articles' => $articles,
        ]);
    }

    public function create(): Response
    {
        $categories = ArticleCategory::orderBy('display_order')->get(['id', 'name']);

        return Inertia::render('admin/articles/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:article_categories,id',
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'body' => 'required|string',
            'status' => 'required|in:draft,pending_review,approved,published',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);
        $validated['author_id'] = auth()->id();

        if ($validated['status'] === 'published') {
            $validated['published_by'] = auth()->id();
            $validated['published_at'] = now();
        }

        $article = Article::create($validated);
        AuditLog::log('article.created', 'articles', $article->id, null, $article->toArray());

        return redirect()->route('admin.articles.index')->with('success', 'Article created.');
    }

    public function edit(int $id): Response
    {
        $article = Article::findOrFail($id);
        $categories = ArticleCategory::orderBy('display_order')->get(['id', 'name']);

        return Inertia::render('admin/articles/edit', [
            'article' => $article,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $article = Article::findOrFail($id);
        $previous = $article->toArray();

        $validated = $request->validate([
            'category_id' => 'required|exists:article_categories,id',
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'body' => 'required|string',
            'status' => 'required|in:draft,pending_review,approved,published,archived',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
        ]);

        if ($validated['status'] === 'published' && ! $article->published_at) {
            $validated['published_by'] = auth()->id();
            $validated['published_at'] = now();
        }

        $article->update($validated);
        AuditLog::log('article.updated', 'articles', $article->id, $previous, $article->fresh()->toArray());

        return redirect()->route('admin.articles.index')->with('success', 'Article updated.');
    }

    public function publish(int $id): RedirectResponse
    {
        $article = Article::findOrFail($id);
        $article->update([
            'status' => 'published',
            'published_by' => auth()->id(),
            'published_at' => now(),
        ]);

        AuditLog::log('article.published', 'articles', $article->id, ['status' => 'pending_review'], ['status' => 'published']);

        return back()->with('success', "Article '{$article->title}' published.");
    }

    public function destroy(int $id): RedirectResponse
    {
        $article = Article::findOrFail($id);
        $article->delete();

        AuditLog::log('article.deleted', 'articles', $id);

        return back()->with('success', 'Article deleted.');
    }
}
