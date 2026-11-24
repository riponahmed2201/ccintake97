import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/passkey-verify';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

const fieldClass =
    'h-12 rounded-xl border-[#0B1220]/10 bg-[#FAF7F0] text-[15px] shadow-none placeholder:text-[#0B1220]/35 focus-visible:border-[#9A7B3F] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#C9A55C]/15';

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Sign in" />

            {status && (
                <div className="mb-6 rounded-xl bg-[#0B1220]/[0.04] px-4 py-3 text-center text-sm font-medium text-[#0B1220]">{status}</div>
            )}

            <PasskeyVerify />

            <Form {...store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-[13px] font-medium text-[#0B1220]/70">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="you@email.com"
                                    className={fieldClass}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="text-[13px] font-medium text-[#0B1220]/70">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink href={request()} className="ml-auto text-[13px] text-[#7A5E28]" tabIndex={5}>
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Your password"
                                    className={fieldClass}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Checkbox id="remember" name="remember" tabIndex={3} />
                                <Label htmlFor="remember" className="text-[14px] font-normal text-[#4A4F5C]">
                                    Remember this device
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-1 h-12 w-full rounded-full bg-[#0B1220] text-[15px] font-medium text-white hover:bg-[#1A2438]"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Sign in
                            </Button>
                        </div>

                        <p className="text-center text-[14px] text-[#4A4F5C]">
                            Not on the roll yet?{' '}
                            <TextLink href="/register-alumni" className="font-medium text-[#7A5E28]" tabIndex={5}>
                                Apply for membership
                            </TextLink>
                        </p>
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Welcome back.',
    description: 'Use the email and password from your membership account.',
};
