import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

type FlashProps = {
    success?: string | null;
    error?: string | null;
    warning?: string | null;
    info?: string | null;
    toast?: FlashToast;
};

function showFlash(flash?: FlashProps) {
    if (!flash) return;
    if (flash.toast) {
        toast[flash.toast.type](flash.toast.message);
    }
    if (flash.success) toast.success(flash.success);
    if (flash.error) toast.error(flash.error);
    if (flash.warning) toast.warning(flash.warning);
    if (flash.info) toast.info(flash.info);
}

export function useFlashToast(): void {
    useEffect(() => {
        const offFlash = router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash as FlashProps | undefined;
            showFlash(flash);
        });

        const offSuccess = router.on('success', (event) => {
            const page = (event as CustomEvent).detail?.page;
            const flash = page?.props?.flash as FlashProps | undefined;
            showFlash(flash);
        });

        return () => {
            offFlash();
            offSuccess();
        };
    }, []);
}
