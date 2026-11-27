<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\Member;
use App\Http\Controllers\Public;
use Illuminate\Support\Facades\Route;

// Public Portal
Route::get('/', [Public\HomeController::class, 'index'])->name('home');
Route::get('/about', [Public\MarketingPageController::class, 'about'])->name('about');
Route::get('/colleges', [Public\MarketingPageController::class, 'colleges'])->name('colleges');
Route::get('/committee', [Public\MarketingPageController::class, 'committee'])->name('committee');
Route::get('/welfare', [Public\MarketingPageController::class, 'welfare'])->name('welfare');
Route::get('/gallery', [Public\MarketingPageController::class, 'gallery'])->name('gallery');
Route::get('/contact', [Public\MarketingPageController::class, 'contact'])->name('contact');
Route::get('/directory', [Public\DirectoryController::class, 'index'])->name('directory.public');
Route::get('/directory/{id}', [Public\DirectoryController::class, 'show'])->whereNumber('id')->name('directory.public.show');
Route::get('/news', [Public\ArticleController::class, 'index'])->name('news.index');
Route::get('/news/{slug}', [Public\ArticleController::class, 'show'])->name('news.show');
Route::get('/register-alumni', [Public\RegistrationController::class, 'create'])->name('register.alumni');
Route::post('/register-alumni', [Public\RegistrationController::class, 'store'])->name('register.alumni.store');
Route::post('/contact', [Public\ContactController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contact.store');

// Smart Dashboard Redirection
Route::middleware(['auth'])->get('/dashboard', function () {
    $user = auth()->user();
    if ($user->hasAnyRole(['super_admin', 'association_admin', 'membership_manager', 'membership_reviewer', 'event_manager', 'content_editor', 'content_publisher'])) {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('member.dashboard');
})->name('dashboard');

// Member Portal Routes
Route::middleware(['auth'])->prefix('member')->name('member.')->group(function () {
    Route::get('/dashboard', [Member\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [Member\ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [Member\ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/photo', [Member\ProfileController::class, 'updatePhoto'])->name('profile.photo');
    Route::put('/profile/cadet', [Member\ProfileController::class, 'updateCadet'])->name('profile.cadet');
    Route::put('/privacy', [Member\ProfileController::class, 'updatePrivacy'])->name('privacy.update');
    Route::get('/id-card', [Member\IdCardController::class, 'show'])->name('id_card');

    Route::get('/directory', [Member\DirectoryController::class, 'index'])->name('directory.index');
    Route::get('/directory/{id}', [Member\DirectoryController::class, 'show'])->name('directory.show');

    Route::get('/connections', [Member\ConnectionController::class, 'index'])->name('connections.index');
    Route::post('/connections/{memberId}/send', [Member\ConnectionController::class, 'send'])->name('connections.send');
    Route::put('/connections/{id}/accept', [Member\ConnectionController::class, 'accept'])->name('connections.accept');
    Route::put('/connections/{id}/reject', [Member\ConnectionController::class, 'reject'])->name('connections.reject');
    Route::delete('/connections/{id}', [Member\ConnectionController::class, 'remove'])->name('connections.remove');

    Route::get('/events', [Member\EventController::class, 'index'])->name('events.index');
    Route::get('/events/{slug}', [Member\EventController::class, 'show'])->name('events.show');
    Route::post('/events/{id}/register', [Member\EventController::class, 'register'])->name('events.register');
    Route::delete('/events/{registrationId}/cancel', [Member\EventController::class, 'cancel'])->name('events.cancel');

    Route::get('/articles', [Member\ArticleController::class, 'index'])->name('articles.index');
    Route::get('/articles/{slug}', [Member\ArticleController::class, 'show'])->name('articles.show');
    Route::get('/gallery', [Member\GalleryController::class, 'index'])->name('gallery.index');

    Route::get('/businesses', [Member\BusinessController::class, 'index'])->name('businesses.index');
    Route::post('/businesses', [Member\BusinessController::class, 'store'])->name('businesses.store');

    Route::get('/mentorship', [Member\MentorshipController::class, 'index'])->name('mentorship.index');
    Route::post('/mentorship/profile', [Member\MentorshipController::class, 'updateProfile'])->name('mentorship.profile');
    Route::post('/mentorship/request', [Member\MentorshipController::class, 'sendRequest'])->name('mentorship.request');
    Route::put('/mentorship/respond/{id}', [Member\MentorshipController::class, 'respond'])->name('mentorship.respond');

    Route::get('/tickets', [Member\TicketController::class, 'index'])->name('tickets.index');
    Route::post('/tickets', [Member\TicketController::class, 'store'])->name('tickets.store');
    Route::get('/tickets/{id}', [Member\TicketController::class, 'show'])->name('tickets.show');
    Route::post('/tickets/{id}/reply', [Member\TicketController::class, 'reply'])->name('tickets.reply');

    Route::get('/notifications', [Member\NotificationController::class, 'index'])->name('notifications.index');
    Route::put('/notifications/{id}/read', [Member\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [Member\NotificationController::class, 'markAllAsRead'])->name('notifications.read_all');

    Route::get('/favorites', [Member\FavoriteController::class, 'index'])->name('favorites.index');
    Route::post('/favorites/toggle', [Member\FavoriteController::class, 'toggle'])->name('favorites.toggle');
});

// Admin Panel Routes
Route::middleware(['auth', 'role_or_permission:super_admin|admin.access'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');

        // Members
        Route::get('/members', [Admin\MemberController::class, 'index'])->name('members.index');
        Route::post('/members', [Admin\MemberController::class, 'store'])->name('members.store');
        Route::get('/members/export', [Admin\MemberController::class, 'export'])->name('members.export');
        Route::get('/members/{id}/edit', [Admin\MemberController::class, 'edit'])->name('members.edit');
        Route::get('/members/{id}', [Admin\MemberController::class, 'show'])->name('members.show');
        Route::put('/members/{id}', [Admin\MemberController::class, 'update'])->name('members.update');
        Route::post('/members/{id}/approve', [Admin\MemberController::class, 'approve'])->name('members.approve');
        Route::post('/members/{id}/verify', [Admin\MemberController::class, 'verify'])->name('members.verify');
        Route::post('/members/{id}/suspend', [Admin\MemberController::class, 'suspend'])->name('members.suspend');
        Route::post('/members/{id}/reactivate', [Admin\MemberController::class, 'reactivate'])->name('members.reactivate');
        Route::post('/members/{id}/assign-code', [Admin\MemberController::class, 'assignCode'])->name('members.assign_code');

        // Membership Applications
        Route::get('/applications', [Admin\ApplicationController::class, 'index'])->name('applications.index');
        Route::get('/applications/{id}', [Admin\ApplicationController::class, 'show'])->name('applications.show');
        Route::post('/applications/{id}/decide', [Admin\ApplicationController::class, 'decide'])->name('applications.decide');

        // Colleges
        Route::get('/colleges', [Admin\CollegeController::class, 'index'])->name('colleges.index');
        Route::post('/colleges', [Admin\CollegeController::class, 'store'])->name('colleges.store');
        Route::put('/colleges/{id}', [Admin\CollegeController::class, 'update'])->name('colleges.update');
        Route::post('/colleges/{id}/toggle', [Admin\CollegeController::class, 'toggleParticipation'])->name('colleges.toggle');
        Route::post('/colleges/{id}/logo', [Admin\CollegeController::class, 'uploadLogo'])->name('colleges.logo');
        Route::delete('/colleges/{id}/logo', [Admin\CollegeController::class, 'removeLogo'])->name('colleges.logo.remove');

        // Leadership & Committees
        Route::get('/committees', [Admin\CommitteeController::class, 'index'])->name('committees.index');
        Route::post('/committees', [Admin\CommitteeController::class, 'store'])->name('committees.store');
        Route::post('/committees/{id}/members', [Admin\CommitteeController::class, 'assignMember'])->name('committees.assign_member');
        Route::delete('/committees/members/{id}', [Admin\CommitteeController::class, 'removeMember'])->name('committees.remove_member');

        // Events
        Route::get('/events', [Admin\EventController::class, 'index'])->name('events.index');
        Route::get('/events/create', [Admin\EventController::class, 'create'])->name('events.create');
        Route::post('/events', [Admin\EventController::class, 'store'])->name('events.store');
        Route::get('/events/{id}/edit', [Admin\EventController::class, 'edit'])->name('events.edit');
        Route::put('/events/{id}', [Admin\EventController::class, 'update'])->name('events.update');
        Route::post('/events/{id}/publish', [Admin\EventController::class, 'publish'])->name('events.publish');
        Route::get('/events/{id}/registrations', [Admin\EventController::class, 'registrations'])->name('events.registrations');
        Route::post('/events/checkin', [Admin\EventController::class, 'checkin'])->name('events.checkin');

        // Articles & News
        Route::get('/articles', [Admin\ArticleController::class, 'index'])->name('articles.index');
        Route::get('/articles/create', [Admin\ArticleController::class, 'create'])->name('articles.create');
        Route::post('/articles', [Admin\ArticleController::class, 'store'])->name('articles.store');
        Route::get('/articles/{id}/edit', [Admin\ArticleController::class, 'edit'])->name('articles.edit');
        Route::put('/articles/{id}', [Admin\ArticleController::class, 'update'])->name('articles.update');
        Route::post('/articles/{id}/publish', [Admin\ArticleController::class, 'publish'])->name('articles.publish');
        Route::delete('/articles/{id}', [Admin\ArticleController::class, 'destroy'])->name('articles.destroy');

        // Businesses
        Route::get('/businesses', [Admin\BusinessController::class, 'index'])->name('businesses.index');
        Route::post('/businesses', [Admin\BusinessController::class, 'store'])->name('businesses.store');
        Route::post('/businesses/{id}/verify', [Admin\BusinessController::class, 'verify'])->name('businesses.verify');
        Route::post('/businesses/{id}/reject', [Admin\BusinessController::class, 'reject'])->name('businesses.reject');
        Route::post('/businesses/{id}/feature', [Admin\BusinessController::class, 'toggleFeatured'])->name('businesses.feature');

        // Initiatives
        Route::get('/initiatives', [Admin\InitiativeController::class, 'index'])->name('initiatives.index');
        Route::post('/initiatives', [Admin\InitiativeController::class, 'store'])->name('initiatives.store');

        // Tickets
        Route::get('/tickets', [Admin\TicketController::class, 'index'])->name('tickets.index');
        Route::get('/tickets/{id}', [Admin\TicketController::class, 'show'])->name('tickets.show');
        Route::post('/tickets/{id}/reply', [Admin\TicketController::class, 'reply'])->name('tickets.reply');
        Route::put('/tickets/{id}/status', [Admin\TicketController::class, 'updateStatus'])->name('tickets.status');

        // Audit Logs, Reports, Roles, Settings
        Route::get('/audit-logs', [Admin\AuditLogController::class, 'index'])->name('audit_logs.index');
        Route::get('/reports', [Admin\ReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/download/{type}', [Admin\ReportController::class, 'download'])->name('reports.download');
        // Users, Roles & Settings
        Route::get('/users', [Admin\UserController::class, 'index'])->name('users.index');
        Route::post('/users', [Admin\UserController::class, 'store'])->name('users.store');
        Route::post('/users/{userId}/roles', [Admin\UserController::class, 'assignRoles'])->name('users.assign_roles');
        Route::post('/users/{userId}/toggle-status', [Admin\UserController::class, 'toggleStatus'])->name('users.toggle_status');

        Route::get('/roles', [Admin\RoleController::class, 'index'])->name('roles.index');
        Route::post('/roles', [Admin\RoleController::class, 'store'])->name('roles.store');
        Route::put('/roles/{roleId}', [Admin\RoleController::class, 'update'])->name('roles.update');
        Route::delete('/roles/{roleId}', [Admin\RoleController::class, 'destroy'])->name('roles.destroy');
        Route::get('/settings', [Admin\SettingController::class, 'index'])->name('settings.index');
        Route::put('/settings', [Admin\SettingController::class, 'update'])->name('settings.update');

        // Website & CMS
        Route::get('/cms/hero', [Admin\CmsHeroController::class, 'index'])->name('cms.hero');
        Route::put('/cms/hero/config', [Admin\CmsHeroController::class, 'updateConfig'])->name('cms.hero.config');
        Route::post('/cms/hero/slides', [Admin\CmsHeroController::class, 'storeSlide'])->name('cms.hero.slides.store');
        Route::post('/cms/hero/slides/{id}', [Admin\CmsHeroController::class, 'updateSlide'])->name('cms.hero.slides.update');
        Route::delete('/cms/hero/slides/{id}', [Admin\CmsHeroController::class, 'destroySlide'])->name('cms.hero.slides.destroy');
        Route::post('/cms/hero/banners', [Admin\CmsHeroController::class, 'updateBanners'])->name('cms.hero.banners');

        Route::get('/cms/sections', [Admin\CmsSectionController::class, 'index'])->name('cms.sections');
        Route::post('/cms/sections/config', [Admin\CmsSectionController::class, 'updateSection'])->name('cms.sections.config');
        Route::post('/cms/sections/milestones', [Admin\CmsSectionController::class, 'storeMilestone'])->name('cms.sections.milestones.store');
        Route::put('/cms/sections/milestones/{id}', [Admin\CmsSectionController::class, 'updateMilestone'])->name('cms.sections.milestones.update');
        Route::delete('/cms/sections/milestones/{id}', [Admin\CmsSectionController::class, 'destroyMilestone'])->name('cms.sections.milestones.destroy');
        Route::put('/cms/sections/inquiries/{id}', [Admin\CmsSectionController::class, 'updateInquiry'])->name('cms.sections.inquiries.update');

        Route::get('/gallery', [Admin\GalleryController::class, 'index'])->name('gallery.index');
        Route::post('/gallery', [Admin\GalleryController::class, 'store'])->name('gallery.store');
        Route::post('/gallery/{id}', [Admin\GalleryController::class, 'update'])->name('gallery.update');
        Route::delete('/gallery/{id}', [Admin\GalleryController::class, 'destroy'])->name('gallery.destroy');
    });

require __DIR__.'/settings.php';
