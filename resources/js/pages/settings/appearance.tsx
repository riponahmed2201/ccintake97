import { Head, usePage } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import AdminLayout from '@/layouts/admin-layout';
import MemberLayout from '@/layouts/member-layout';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Appearance() {
    const { auth } = usePage<PageProps>().props;
    const roles = auth?.user?.roles ?? [];
    const isAdminUser = roles.some((r) => !['regular_member', 'verified_member'].includes(r));

    const content = (
        <>
            <Head title="Appearance Settings - CCINTAKE 97" />

            <div className="w-full space-y-6">
                <div>
                    <h1 className="text-[20px] font-bold tracking-tight text-[#071437]">
                        Appearance Settings
                    </h1>
                    <p className="mt-1 text-[13px] text-[#78829D]">
                        Customize the interface theme preference for your account.
                    </p>
                </div>
                <div className="rounded-xl border border-[#F1F1F4] bg-white p-6 shadow-[0_3px_4px_0_rgba(0,0,0,0.03)]">
                    <AppearanceTabs />
                </div>
            </div>
        </>
    );

    if (isAdminUser) {
        return (
            <AdminLayout title="Appearance Settings" breadcrumbs={[{ title: 'Appearance' }]}>
                {content}
            </AdminLayout>
        );
    }

    return <MemberLayout title="Appearance Settings">{content}</MemberLayout>;
}
