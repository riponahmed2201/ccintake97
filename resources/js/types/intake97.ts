export interface College {
    id: number;
    name: string;
    short_name?: string;
    slug: string;
    website?: string;
    established_year?: number;
    location?: string;
    description?: string;
    logo_path?: string;
    logo_url?: string | null;
    cover_image_path?: string;
    is_participating: boolean;
    display_order: number;
    members_count?: number;
}

export interface Industry {
    id: number;
    name: string;
    slug: string;
    display_order: number;
}

export interface MemberPrivacySetting {
    id: number;
    member_id: number;
    field_key: string;
    visibility: 'public' | 'verified_members' | 'connections' | 'private';
}

export interface MemberProfile {
    id: number;
    member_id: number;
    cadet_name?: string;
    city?: string;
    country_code: string;
    address?: string;
    present_address_line?: string;
    present_area?: string;
    present_postal_code?: string;
    same_as_present_address?: boolean;
    permanent_address_line?: string;
    permanent_area?: string;
    permanent_city?: string;
    permanent_postal_code?: string;
    permanent_country_code?: string;
    gender?: string;
    date_of_birth?: string;
    blood_group?: string;
    spouse_name?: string;
    spouse_occupation?: string;
    spouse_job_location?: string;
    children_names?: string[];
    designation?: string;
    job_type?: string;
    organization?: string;
    office_address?: string;
    office_phone?: string;
    industry_id?: number;
    industry?: Industry;
    professional_bio?: string;
    remarks?: string;
    skills?: string[];
    education?: any[];
    employment_history?: any[];
    linkedin_url?: string;
    facebook_url?: string;
    website_url?: string;
    owns_business: boolean;
    profile_completion: number;
}

export interface Member {
    id: number;
    user_id: number;
    member_code?: string;
    college_id: number;
    college?: College;
    college_roll_no?: string;
    intake_year: number;
    house_name?: string;
    house_color?: string;
    membership_status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended' | 'archived';
    verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
    approved_at?: string;
    verified_at?: string;
    suspended_at?: string;
    suspension_reason?: string;
    user?: AuthUser;
    profile?: MemberProfile;
    privacy_settings?: MemberPrivacySetting[];
    applications?: MembershipApplication[];
    verifications?: MembershipVerification[];
}

export interface MembershipVerification {
    id: number;
    member_id: number;
    verified_by?: number;
    verifiedBy?: { id: number; name: string };
    method: 'college_records' | 'alumni_reference' | 'documents' | 'committee_approval';
    result: string;
    evidence_note?: string;
    verified_at: string;
}

export interface MentorshipProfile {
    id: number;
    member_id: number;
    member?: Member;
    is_available: boolean;
    expertise_areas?: string;
    preferred_topics?: string;
    max_mentees?: number;
    consent_given_at?: string;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar_path?: string;
    account_status: string;
    roles: string[];
    permissions: string[];
    member?: Member;
}

export interface MembershipApplication {
    id: number;
    application_no: string;
    member_id: number;
    member?: Member;
    declared_college_id: number;
    declared_college?: College;
    declared_roll_no: string;
    reference_name?: string;
    reference_phone?: string;
    proof_documents?: string[];
    status: 'submitted' | 'under_review' | 'info_required' | 'approved' | 'rejected';
    submitted_at: string;
    decided_at?: string;
    decision_note?: string;
    reviews?: ApplicationReview[];
}

export interface ApplicationReview {
    id: number;
    application_id: number;
    actor_id: number;
    actor?: { id: number; name: string };
    action: string;
    from_status?: string;
    to_status?: string;
    note?: string;
    is_internal: boolean;
    created_at: string;
}

export interface EventCategory {
    id: number;
    name: string;
    slug: string;
}

export interface Event {
    id: number;
    category_id: number;
    category?: EventCategory;
    title: string;
    slug: string;
    description?: string;
    venue: string;
    address?: string;
    city?: string;
    google_maps_link?: string;
    cover_image_path?: string;
    starts_on: string;
    ends_on?: string;
    start_time?: string;
    end_time?: string;
    capacity?: number;
    allows_guests: boolean;
    max_guests_per_registration: number;
    registration_closes_at?: string;
    registration_fee: string | number;
    visibility: 'public' | 'members' | 'verified_members';
    status: 'draft' | 'published' | 'cancelled' | 'completed';
    published_at?: string;
    registrations_count?: number;
    my_registration?: EventRegistration;
}

export interface EventRegistration {
    id: number;
    event_id: number;
    event?: Event;
    member_id: number;
    member?: Member;
    status: 'registered' | 'pending_approval' | 'confirmed' | 'waitlisted' | 'cancelled' | 'attended' | 'no_show';
    guest_count: number;
    special_requirements?: string;
    qr_token: string;
    checked_in_at?: string;
    guests?: { id: number; name: string; relationship: string; age_group: string }[];
    created_at: string;
}

export interface ArticleCategory {
    id: number;
    name: string;
    slug: string;
}

export interface Article {
    id: number;
    category_id: number;
    category?: ArticleCategory;
    title: string;
    slug: string;
    excerpt?: string;
    body: string;
    content?: string;
    cover_image_path?: string;
    author_id: number;
    author?: { id: number; name: string };
    status: 'draft' | 'pending_review' | 'approved' | 'scheduled' | 'published' | 'archived';
    published_at?: string;
    created_at: string;
}

export interface BusinessCategory {
    id: number;
    name: string;
    slug: string;
}

export interface Business {
    id: number;
    owner_member_id: number;
    owner?: Member;
    category_id: number;
    category?: BusinessCategory;
    industry_id: number;
    industry?: Industry;
    name: string;
    slug: string;
    logo_path?: string;
    description?: string;
    services?: string[];
    website?: string;
    email?: string;
    phone?: string;
    city?: string;
    country_code: string;
    is_featured: boolean;
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    verified_at?: string;
}

export interface Committee {
    id: number;
    name: string;
    slug: string;
    description?: string;
    head_member_id?: number;
    head_member?: Member;
    term_start?: string;
    term_end?: string;
    status: 'active' | 'past';
    display_order: number;
    members?: CommitteeMemberItem[];
}

export interface CommitteeMemberItem {
    id: number;
    committee_id: number;
    member_id: number;
    member?: Member;
    position_title: string;
    role_type: string;
    bio?: string;
    display_order: number;
}

export interface Initiative {
    id: number;
    title: string;
    slug: string;
    category: 'scholarship' | 'welfare' | 'medical' | 'emergency' | 'mentorship';
    description?: string;
    coordinator_member_id?: number;
    coordinator?: Member;
    budget?: number;
    target_amount?: number;
    raised_amount: number;
    start_date?: string;
    end_date?: string;
    status: 'draft' | 'active' | 'completed' | 'archived';
    participants_count?: number;
}

export interface SupportTicket {
    id: number;
    ticket_no: string;
    user_id: number;
    user?: { id: number; name: string; email: string };
    category: string;
    subject: string;
    status: 'open' | 'in_progress' | 'waiting_member' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    created_at: string;
    messages?: SupportTicketMessageItem[];
}

export interface SupportTicketMessageItem {
    id: number;
    ticket_id: number;
    sender_id: number;
    sender?: { id: number; name: string };
    message: string;
    attachments?: string[];
    is_internal_note: boolean;
    created_at: string;
}

export interface AuditLogItem {
    id: number;
    user_id?: number;
    user?: { id: number; name: string; email: string };
    action: string;
    module: string;
    record_id?: number;
    previous_state?: any;
    new_state?: any;
    ip_address?: string;
    created_at: string;
}
