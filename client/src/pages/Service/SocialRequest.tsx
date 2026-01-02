import React, { } from 'react';
import PageHeader from "@/components/ui/pageHeader";
import SocialRequest from '@/components/Services/Social/SocialRequest';

const Social = () => {
    return (
        <>
            <div className="space-y-6 animate-fade-in">
                <PageHeader
                    title="Social Verification"
                    description="Verify your user social accounts through our Social Verification service."
                />
            </div>
            <SocialRequest />
        </>
    );
}

export default Social;