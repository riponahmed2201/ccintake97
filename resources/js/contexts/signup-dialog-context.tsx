import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-md" aria-describedby="signup-dialog-desc">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-2xl">Join INTAKE 97</DialogTitle>
                        <DialogDescription id="signup-dialog-desc">
                            Create your account, then complete your cadet college details from your profile.
                        </DialogDescription>
                    </DialogHeader>
                    <AlumniSignupForm compact onSuccess={closeSignup} />
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