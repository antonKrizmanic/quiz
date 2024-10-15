'use client';
import { Suspense } from 'react';

import ResultView from '@/views/ResultView/ResultView';
import LoadingContainer from '@/components/LoadingContainer/LoadingContainer';

function TakeResultPage() {
    return (
        <Suspense fallback={<LoadingContainer isLoading={true} />}>
            <ResultView />
        </Suspense>
    );
}

export default TakeResultPage;