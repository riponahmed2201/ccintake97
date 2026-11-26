import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/admin-layout';
import MemberLayout from '@/layouts/member-layout';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';
import { KeyRound, Save, UserCircle } from 'lucide-react';

type PageProps = {
    auth: Auth;
};

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const roles = auth?.user?.roles ?? [];
    const isAdminUser = roles.some((r) => !['regular_member', 'verified_member'].includes(r));

    const content = (
        <>
            <Head title="Account Profile - CCINTAKE 97" />

            <div className="w-full space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                            Account Profile
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Update your account display name, email address, and security settings.
                        </p>
                    </div>
                    <Link
                        href="/settings/security"
                        className="inline-flex h-9 items-center gap-2 self-start rounded-lg border border-[#DBDFE9] bg-white px-3.5 text-[12.5px] font-semibold text-[#4B5675] transition-colors hover:border-[#1B84FF] hover:bg-[#F1F6FF] hover:text-[#1B84FF] sm:self-auto"
                    >
                        <KeyRound className="size-4" />
                        Password &amp; Security
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="xl:col-span-2">
                        <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                            <div className="flex items-center gap-2.5 border-b border-[#F1F1F4] bg-[#FCFCFC] px-6 py-4">
                                <span className="flex size-8 items-center justify-center rounded-lg bg-[#F1F6FF] text-[#1B84FF]">
                                    <UserCircle className="size-4" />
                                </span>
                                <div>
                                    <h2 className="text-[15px] font-bold text-[#071437]">
                                        Profile Information
                                    </h2>
                                    <p className="text-[12px] text-[#78829D]">
                                        Basic account credentials used for login and audit history.
                                    </p>
                                </div>
                            </div>

                            <Form
                                {...ProfileController.update.form()}
                                options={{
                                    preserveScroll: true,
                                }}
                                className="space-y-4 p-6"
                            >
                                {({ processing, errors, recentlySuccessful }) => (
                                    <>
                                        <div>
                                            <label htmlFor="name" className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                                Full Name
                                            </label>
                                            <Input
                                                id="name"
                                                className={fieldClass}
                                                defaultValue={auth.user.name}
                                                name="name"
                                                required
                                                autoComplete="name"
                                                placeholder="Full name"
                                            />
                                            <InputError className="mt-1.5" message={errors.name} />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                                Email Address
                                            </label>
                                            <Input
                                                id="email"
                                                type="email"
                                                className={fieldClass}
                                                defaultValue={auth.user.email}
                                                name="email"
                                                required
                                                autoComplete="username"
                                                placeholder="Email address"
                                            />
                                            <InputError className="mt-1.5" message={errors.email} />
                                        </div>

                                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[12.5px] text-amber-800">
                                                Your email address is unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="cursor-pointer font-semibold underline underline-offset-4"
                                                >
                                                    Click here to re-send the verification email.
                                                </Link>
                                                {status === 'verification-link-sent' && (
                                                    <div className="mt-1.5 font-medium text-emerald-700">
                                                        A new verification link has been sent to your email address.
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 border-t border-[#F1F1F4] pt-4">
                                            <Button
                                                disabled={processing}
                                                data-test="update-profile-button"
                                                className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                                            >
                                                <Save className="mr-1.5 size-4" />
                                                {processing ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                            {recentlySuccessful && (
                                                <span className="text-[12.5px] font-medium text-emerald-600">
                                                    Saved.
                                                </span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>

                    <div className="xl:col-span-1">
                        <div className="rounded-xl border border-[#F1F1F4] bg-white p-6 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                            <DeleteUser />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    if (isAdminUser) {
        return (
            <AdminLayout title="Account Profile" breadcrumbs={[{ title: 'Account Profile' }]}>
                {content}
            </AdminLayout>
        );
    }

    return <MemberLayout title="Account Profile">{content}</MemberLayout>;
}
