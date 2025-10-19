'use client';
import { Suspense } from 'react';
import LoadingContainer from '@/components/LoadingContainer/LoadingContainer';
import ResultView from '@/views/ResultView/ResultView';

function TakeResultPage() {
    return (
        <Suspense fallback={<LoadingContainer isLoading={true} />}>
            <ResultView />
        </Suspense>
    );
}

export default TakeResultPage;
