'use client';
import { Suspense } from 'react';

import InitQuizView from '@/views/InitQuizView/InitQuizView';
import LoadingContainer from '@/components/LoadingContainer/LoadingContainer';


function InitQuizPage() {
    return (
        <Suspense fallback={<LoadingContainer isLoading={true} />}>
            <InitQuizView />
        </Suspense>);
}

export default InitQuizPage;