'use client';
import { Suspense } from 'react';

import QuizView from '@/views/QuizView/QuizView';
import LoadingContainer from '@/components/LoadingContainer/LoadingContainer';


function QuizPage() {
    return (
        <Suspense fallback={<LoadingContainer isLoading={true} />}>
            <QuizView />
        </Suspense>
    );
}

export default QuizPage;