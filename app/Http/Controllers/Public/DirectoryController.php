<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Support\PublicMemberPresenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DirectoryController extends Controller
{
    private const FIELDS = ['name', 'profession', 'city'];

    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:100',
            'field' => 'nullable|in:'.implode(',', self::FIELDS),
            'college_id' => 'nullable|integer|exists:colleges,id',
        ]);

        $search = trim((string) ($validated['search'] ?? ''));
        $field = $validated['field'] ?? 'name';

        $query = PublicMemberPresenter::query();

        if ($search !== '') {
            $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $search).'%';
            match ($field) {
                // Profession and city only match members who made that field public,
                // so a search can't be used to infer hidden details.
                'profession' => $query->whereHas('profile', fn ($q) => $q
                    ->where(fn ($q) => $q->where('designation', 'like', $like)->orWhere('organization', 'like', $like)))
                    ->whereHas('privacySettings', fn ($q) => $q->whereIn('field_key', ['designation', 'organization'])->where('visibility', 'public')),
                'city' => $query->whereHas('profile', fn ($q) => $q->where('city', 'like', $like))
                    ->whereHas('privacySettings', fn ($q) => $q->where('field_key', 'city')->where('visibility', 'public')),
                default => $query->whereHas('user', fn ($q) => $q->where('name', 'like', $like)),
            };
        }

        if (! empty($validated['college_id'])) {
            $query->where('college_id', $validated['college_id']);
        }

        $members = $query
            ->join('users', 'users.id', '=', 'members.user_id')
            ->orderBy('users.name')
            ->select('members.*')
            ->paginate(24)
            ->withQueryString()
            ->through(fn ($m) => PublicMemberPresenter::present($m));

        return Inertia::render('directory/public', [
            'members' => $members,
            'colleges' => College::where('is_participating', true)->orderBy('display_order')->get(['id', 'name', 'short_name', 'logo_path']),
            'filters' => ['search' => $search, 'field' => $field, 'college_id' => $validated['college_id'] ?? null],
            'total' => PublicMemberPresenter::query()->count(),
        ]);
    }

    public function show(int $id): Response
    {
        $member = PublicMemberPresenter::query()
            ->with(['profile.industry', 'businesses' => fn ($q) => $q->where('status', 'approved')])
            ->findOrFail($id);

        $base = PublicMemberPresenter::present($member);
        $privacy = $member->privacySettings->pluck('visibility', 'field_key');
        $isPublic = fn (string $field): bool => $privacy->get($field) === 'public';

        return Inertia::render('directory/show', [
            'member' => array_merge($base, [
                'intake_year' => $member->intake_year,
                'industry' => $isPublic('organization') || $isPublic('designation') ? $member->profile?->industry?->name : null,
                'professional_bio' => $member->profile?->professional_bio,
                'linkedin_url' => $isPublic('linkedin') ? $member->profile?->linkedin_url : null,
                'website_url' => $isPublic('organization') ? $member->profile?->website_url : null,
                // Approved businesses are already public on the landing page; contact
                // details (email/phone) are intentionally left out.
                'businesses' => $member->businesses->map(fn ($b) => [
                    'id' => $b->id,
                    'name' => $b->name,
                    'description' => $b->description,
                    'website' => $b->website,
                    'city' => $b->city,
                    'logo_url' => $b->logo_path ? asset('storage/'.ltrim($b->logo_path, '/')) : null,
                ])->values(),
            ]),
        ]);
    }
}
