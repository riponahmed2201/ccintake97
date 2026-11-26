import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import BrandMark from '@/components/brand-mark';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { AlumniSignupForm } from '@/components/auth/alumni-signup-form';

type SignupDialogContextValue = {
    open: boolean;
    openSignup: () => void;
    closeSignup: () => void;
};

const SignupDialogContext = createContext<SignupDialogContextValue | null>(null);

export function SignupDialogProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    const openSignup = useCallback(() => setOpen(true), []);
    const closeSignup = useCallback(() => setOpen(false), []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        if (params.get('signup') === '1') {
            setOpen(true);
            params.delete('signup');
            const q = params.toString();
            const next = `${window.location.pathname}${q ? `?${q}` : ''}${window.location.hash}`;
            window.history.replaceState({}, '', next);
        }
    }, []);

    const value = useMemo(() => ({ open, openSignup, closeSignup }), [open, openSignup, closeSignup]);

    return (
        <SignupDialogContext.Provider value={value}>
            {children}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    className="max-h-[92vh] overflow-y-auto rounded-3xl border border-[#C8A252]/30 bg-white p-0 shadow-[0_32px_80px_-20px_rgba(9,19,36,0.55)] sm:max-w-[460px] [&>button]:top-5 [&>button]:right-5 [&>button]:text-white/70 [&>button]:hover:bg-white/10 [&>button]:hover:text-white"
                    aria-describedby="signup-dialog-desc"
                >
                    <div className="relative overflow-hidden bg-[#091324] px-6 pt-7 pb-6 text-[#F8F5EE] sm:px-8">
                        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(200,162,82,0.28),transparent_65%)]" />
                        <DialogHeader className="relative text-left">
                            <div className="mb-3 flex items-center gap-3">
                                <BrandMark className="h-9 w-auto shrink-0" />
                                <span className="text-[10.5px] font-semibold tracking-[0.24em] text-[#E8D5A3] uppercase">
                                    Class of 1997 · Alumni Portal
                                </span>
                            </div>
                            <DialogTitle className="font-serif text-3xl font-medium tracking-[-0.01em] text-white">
                                Join <em className="font-normal italic text-[#E8D5A3]">CCINTAKE 97</em>
                            </DialogTitle>
                            <DialogDescription id="signup-dialog-desc" className="mt-1.5 text-[13.5px] leading-relaxed text-[#F8F5EE]/70">
                                Create your member account, then complete your cadet college and roll details inside your portal.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <div className="p-6 sm:p-8">
                        <AlumniSignupForm compact onSuccess={closeSignup} />
                    </div>
                </DialogContent>
            </Dialog>
        </SignupDialogContext.Provider>
    );
}

export function useSignupDialog() {
    const ctx = useContext(SignupDialogContext);
    if (!ctx) {
        return {
            open: false,
            openSignup: () => {
                window.location.href = '/register-alumni';
            },
            closeSignup: () => {},
        };
    }
    return ctx;
}