'use client';

export const dynamic = 'force-dynamic';
import SubmitOtp from '@components/submitOtp';
import { Suspense } from 'react';

const SubmitOtpPage = () => {
    return (
        <Suspense fallback={<p>......</p>}>
            <SubmitOtp />
        </Suspense>
    );
};

export default SubmitOtpPage;
