<?php

namespace App\Support;

use App\Models\Member;
use Illuminate\Database\Eloquent\Builder;

/**
 * Shapes a member for anonymous (public) viewing.
 *
 * Name and college are always shown — that is the point of a directory.
 * Every other field is shown only when the member has explicitly set its
 * privacy to "public". Contact details (email, phone) and date of birth are
 * never exposed here, whatever the setting.
 */
class PublicMemberPresenter
{
    /** Members eligible for public listing. */
    public static function query(): Builder
    {
        return Member::query()
            ->with(['user:id,name,avatar_path', 'college:id,name,short_name,logo_path', 'profile:id,member_id,designation,organization,city,country_code', 'privacySettings:id,member_id,field_key,visibility'])
            ->where('verification_status', 'verified')
            ->where('membership_status', 'approved')
            ->whereHas('user');
    }

    public static function present(Member $member): array
    {
        $privacy = $member->privacySettings->pluck('visibility', 'field_key');
        $isPublic = fn (string $field): bool => $privacy->get($field) === 'public';

        $name = (string) $member->user?->name;
        $avatar = $member->user?->avatar_path;

        return [
            'id' => $member->id,
            'name' => $name,
            'initials' => self::initials($name),
            'college' => $member->college ? [
                'id' => $member->college->id,
                'name' => $member->college->name,
                'short_name' => $member->college->short_name,
                'logo_url' => $member->college->logo_url,
            ] : null,
            'photo_url' => $avatar && $isPublic('photo') ? self::url($avatar) : null,
            'designation' => $isPublic('designation') ? $member->profile?->designation : null,
            'organization' => $isPublic('organization') ? $member->profile?->organization : null,
            'city' => $isPublic('city') ? $member->profile?->city : null,
            'country_code' => $isPublic('country') ? $member->profile?->country_code : null,
        ];
    }

    private static function initials(string $name): string
    {
        $parts = preg_split('/\s+/', preg_replace('/^(Brig\.|Gen\.|Dr\.|Md\.|Barrister|Lt\.|Col\.|Maj\.)\s*/i', '', trim($name))) ?: [];
        $letters = array_map(fn ($p) => mb_strtoupper(mb_substr($p, 0, 1)), array_filter($parts, fn ($p) => preg_match('/^\p{L}/u', $p)));

        return implode('', array_slice($letters, 0, 2)) ?: '97';
    }

    private static function url(string $path): string
    {
        if (preg_match('#^(https?:)?//#', $path)) {
            return $path;
        }

        if (str_starts_with($path, '/')) {
            return asset(ltrim($path, '/'));
        }

        return asset('storage/'.ltrim($path, '/'));
    }
}
