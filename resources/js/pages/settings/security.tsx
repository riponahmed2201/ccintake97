import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import type { Props as ManagePasskeysProps } from '@/components/manage-passkeys';
import ManagePasskeys from '@/components/manage-passkeys';
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import MemberLayout from '@/layouts/member-layout';
import type { Auth } from '@/types';
import { KeyRound, Save, ShieldCheck, UserCircle } from 'lucide-react';

type PageProps = {
    auth: Auth;
};

// oxfmt-ignore
type Props = {
    passwordRules: string;
} & ManagePasskeysProps &
    ManageTwoFactorProps;

const fieldClass =
    'h-10 w-full rounded-md border !border-[#DBDFE9] !bg-[#FCFCFC] px-3 text-[13px] font-normal !text-[#071437] !shadow-none outline-none transition-all duration-200 placeholder:!text-[#99A1B7] hover:!border-[#C4CADA] focus:!border-[#1B84FF] focus:!bg-white focus:!ring-[3px] focus:!ring-[#1B84FF]/10 dark:!bg-[#FCFCFC] dark:!text-[#071437]';

export default function Security(props: Props) {
    const { auth } = usePage<PageProps>().props;
    const roles = auth?.user?.roles ?? [];
    const isAdminUser = roles.some((r) => !['regular_member', 'verified_member'].includes(r));

    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const content = (
        <>
            <Head title="Password & Security - CCINTAKE 97" />

            <div className="w-full space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                            Password &amp; Security
                        </h1>
                        <p className="mt-1 text-[13px] text-[#78829D]">
                            Manage your account password, two-factor authentication, and passkeys.
                        </p>
                    </div>
                    <Link
                        href="/settings/profile"
                        className="inline-flex h-9 items-center gap-2 self-start rounded-lg border border-[#DBDFE9] bg-white px-3.5 text-[12.5px] font-semibold text-[#4B5675] transition-colors hover:border-[#1B84FF] hover:bg-[#F1F6FF] hover:text-[#1B84FF] sm:self-auto"
                    >
                        <UserCircle className="size-4" />
                        Account Profile
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                        <div className="flex items-center gap-2.5 border-b border-[#F1F1F4] bg-[#FCFCFC] px-6 py-4">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-[#F1F6FF] text-[#1B84FF]">
                                <KeyRound className="size-4" />
                            </span>
                            <div>
                                <h2 className="text-[15px] font-bold text-[#071437]">
                                    Update Password
                                </h2>
                                <p className="text-[12px] text-[#78829D]">
                                    Use a strong, unique password to keep your account secure.
                                </p>
                            </div>
                        </div>

                        <Form
                            {...SecurityController.update.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            resetOnError={[
                                'password',
                                'password_confirmation',
                                'current_password',
                            ]}
                            resetOnSuccess
                            onError={(errors) => {
                                if (errors.password) {
                                    passwordInput.current?.focus();
                                }

                                if (errors.current_password) {
                                    currentPasswordInput.current?.focus();
                                }
                            }}
                            className="space-y-4 p-6"
                        >
                            {({ errors, processing, recentlySuccessful }) => (
                                <>
                                    <div>
                                        <label htmlFor="current_password" className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                            Current Password
                                        </label>
                                        <PasswordInput
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            className={fieldClass}
                                            autoComplete="current-password"
                                            placeholder="Current password"
                                        />
                                        <InputError className="mt-1.5" message={errors.current_password} />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                            New Password
                                        </label>
                                        <PasswordInput
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            className={fieldClass}
                                            autoComplete="new-password"
                                            placeholder="New password"
                                            passwordrules={props.passwordRules}
                                        />
                                        <InputError className="mt-1.5" message={errors.password} />
                                    </div>

                                    <div>
                                        <label htmlFor="password_confirmation" className="mb-1.5 block text-[12.5px] font-semibold text-[#071437]">
                                            Confirm Password
                                        </label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            className={fieldClass}
                                            autoComplete="new-password"
                                            placeholder="Confirm password"
                                            passwordrules={props.passwordRules}
                                        />
                                        <InputError className="mt-1.5" message={errors.password_confirmation} />
                                    </div>

                                    <div className="flex items-center gap-3 border-t border-[#F1F1F4] pt-4">
                                        <Button
                                            disabled={processing}
                                            data-test="update-password-button"
                                            className="h-9 cursor-pointer rounded-lg bg-[#1B84FF] px-4 text-[13px] font-semibold text-white hover:bg-[#1B84FF]/90"
                                        >
                                            <Save className="mr-1.5 size-4" />
                                            {processing ? 'Updating...' : 'Update Password'}
                                        </Button>
                                        {recentlySuccessful && (
                                            <span className="text-[12.5px] font-medium text-emerald-600">
                                                Updated.
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl border border-[#F1F1F4] bg-white p-6 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                            <div className="mb-4 flex items-center gap-2.5 border-b border-[#F1F1F4] pb-3.5">
                                <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                    <ShieldCheck className="size-4" />
                                </span>
                                <h2 className="text-[15px] font-bold text-[#071437]">
                                    Two-Factor &amp; Passkeys
                                </h2>
                            </div>
                            <div className="space-y-6">
                                <ManageTwoFactor
                                    canManageTwoFactor={props.canManageTwoFactor}
                                    requiresConfirmation={props.requiresConfirmation}
                                    twoFactorEnabled={props.twoFactorEnabled}
                                />
                                <ManagePasskeys
                                    canManagePasskeys={props.canManagePasskeys}
                                    passkeys={props.passkeys}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    if (isAdminUser) {
        return (
            <AdminLayout title="Password & Security" breadcrumbs={[{ title: 'Password & Security' }]}>
                {content}
            </AdminLayout>
        );
    }

    return <MemberLayout title="Password & Security">{content}</MemberLayout>;
}
