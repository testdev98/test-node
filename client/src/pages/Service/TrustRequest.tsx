import React, { } from 'react';
import PageHeader from "@/components/ui/pageHeader";
import TrustRequest from '@/components/Services/Trust/TrustRequest';

const Trust = () => {
    return (
        <>
            <div className="space-y-6 animate-fade-in">
                <PageHeader
                    title="Trust Verification"
                    description="Verify email, phone, and IP address trust scores through our comprehensive Trust Verification service."
                />
            </div>
            <TrustRequest />
        </>
    );
}

export default Trust;