'use client';
import { Suspense } from 'react';
import LoadingContainer from '@/components/LoadingContainer/LoadingContainer';
import InitQuizView from '@/views/InitQuizView/InitQuizView';

function InitQuizPage() {
    return (
        <Suspense fallback={<LoadingContainer isLoading={true} />}>
            <InitQuizView />
        </Suspense>
    );
}

export default InitQuizPage;
