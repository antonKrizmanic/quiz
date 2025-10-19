'use client';
import { Suspense } from 'react';
import LoadingContainer from '@/components/LoadingContainer/LoadingContainer';
import QuizView from '@/views/QuizView/QuizView';

function QuizPage() {
    return (
        <Suspense fallback={<LoadingContainer isLoading={true} />}>
            <QuizView />
        </Suspense>
    );
}

export default QuizPage;
