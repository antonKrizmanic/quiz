'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { get } from '../../services/HttpService';
import BigRedButton from '@/components/Buttons/BigRedButton';

interface QuizTakeDetailViewModel extends QuizTakeViewModel {
    quizTakeQuestions: QuizTakeQuestionViewModel[];
}

interface QuizTakeViewModel {
    id: number;
    quizId: number;
    quizTitle: string;
    takeUserName: string;
    score: number;
    questionNumber: number;
    startedAt: Date;
    endedAt: Date;
    takeUserType: string;
}

interface QuizTakeQuestionViewModel {
    id: number;
    questionId: number;
    index: number;
    parentId?: number | null;
    isCorrect: boolean;
    children: QuizTakeQuestionViewModel[];
    answers: QuizTakeAnswerViewModel[];
}

interface QuizTakeAnswerViewModel {
    questionId: number;
    answerId: number;
    text: string;
    isCorrect: boolean;
}


const TakeResultPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const takeId = searchParams.get('take-id');
    const [loading, setLoading] = useState<boolean>(true);
    const [results, setResults] = useState<QuizTakeDetailViewModel[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            if (!takeId) return;

            try {
                const response = await get(`quizzes/PublicQuizTake/Get/${takeId}`);
                setResults(response.data);
            } catch (error) {
                console.error('Error fetching quiz results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [takeId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (results.length === 0) {
        return (
            <div className="lg:max-w-screen-md w-screen mx-auto md:px-6">
                <div className="flex justify-center px-3">
                    <div className="w-full">
                        <div className="bg-white shadow-md rounded-lg px-3">
                            <p className="mb-3 text-center">No results found for this quiz.</p>
                            <BigRedButton onClick={() => router.back()}>
                                <i className="fas fa-arrow-left"></i> Back
                            </BigRedButton>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:max-w-screen-md w-screen mx-auto md:px-6 mt-6">
            <div className="flex justify-center px-3">
                <div className="w-full">
                    <div className="bg-white shadow-md rounded-lg px-3">
                        <h2 className="text-center text-2xl font-bold mb-4">Quiz Results</h2>
                        <p className="text-center mb-4">Quiz Title: {results.quizTitle}</p>
                        <p className="text-center mb-4">User: {results.takeUserName}</p>
                        <p className="text-center mb-4">Score: {results.score}/{results.questionNumber}</p>
                        {results.quizTakeQuestions.map((question, index) => (
                            <div key={index} className="mb-4">
                                <p className="font-semibold">Question {index + 1}: {question.questionId}</p>
                                {question.answers.map((answer, answerIndex) => (
                                    <div key={answerIndex} className="ml-4">
                                        <p>Your Answer: {answer.text}</p>
                                        <p className={answer.isCorrect ? 'text-green-500' : 'text-red-500'}>
                                            {answer.isCorrect ? 'Correct' : 'Incorrect'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div className="flex justify-center mt-4">
                            <BigRedButton onClick={() => router.back()}>
                                <i className="fas fa-arrow-left"></i> Back
                            </BigRedButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TakeResultPage;