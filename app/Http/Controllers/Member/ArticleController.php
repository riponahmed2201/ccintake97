<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Article::with(['category', 'author'])
            ->where('status', 'published')
            ->latest('published_at');

        if ($catId = $request->input('category_id')) {
            $query->where('category_id', $catId);
        }

        $articles = $query->paginate(9)->withQueryString();
        $categories = ArticleCategory::orderBy('display_order')->get(['id', 'name']);

        return Inertia::render('member/articles/index', [
            'articles' => $articles,
            'categories' => $categories,
            'selectedCategoryId' => $catId,
        ]);
    }

    public function show(string $slug): Response
    {
        $article = Article::with(['category', 'author', 'publisher'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return Inertia::render('member/articles/show', [
            'article' => $article,
        ]);
    }
}
