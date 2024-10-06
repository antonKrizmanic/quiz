'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { get } from '../../services/HttpService';
import BigRedButton from '@/components/Buttons/BigRedButton';
import BigGrayButton from '@/components/Buttons/BigGrayButton';
import ChooseOneQuestion from '@/components/TakeQuiz/ChooseOneQuestion';
import ChooseManyQuestion from '@/components/TakeQuiz/ChooseManyQuestion';
import TypeAnswerQuestion from '@/components/TakeQuiz/TypeAnswerQuestion';
import MakeMatchQuestion from '@/components/TakeQuiz/MakeMatchQuestion';

interface Answer {
    id: number;
    text: string;
    questionId: number;
}

interface Question {
    id: number;
    text: string;
    questionType: string;
    options: string[];
    parentId: number | null;
    children: Question[] | null;
    answers: Answer[];
}

interface QuizDetail {
    questions: Question[];
}

const QuizPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const quizId = searchParams.get('quizId');
    const [quiz, setQuiz] = useState<QuizDetail | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchQuizDetails = async () => {
            try {
                const response = await get(`/quizzes/PublicQuiz/GetDetail/${quizId}`);
                setQuiz(response.data);
            } catch (error) {
                console.error('Error fetching quiz details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (quizId) {
            fetchQuizDetails();
        }
    }, [quizId]);

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz!.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Navigate to the next step, e.g., user name input
            router.push('/user-name');
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleAnswer = (answer: any) => {
        // Handle the answer submission logic here
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!quiz || quiz.questions.length === 0) {
        return (
            <div className="lg:max-w-screen-md w-screen mx-auto md:px-6">
                <div className="flex justify-center px-3">
                    <div className="w-full">
                        <div className="bg-white shadow-md rounded-lg px-3">
                            <p className="mb-3 text-center">Nažalost, ovaj kviz nema ni jedno pitanje, odaberite drugi</p>
                            <BigRedButton onClick={handleBack}>
                                <i className="fas fa-arrow-left"></i> Natrag
                            </BigRedButton>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <div className="lg:max-w-screen-md w-screen mx-auto md:px-6 mt-6">
            <div className="flex justify-center px-3">
                <div className="w-full">
                    <div className="bg-white shadow-md rounded-lg px-3">                        
                        {currentQuestion.questionType === 1 && (
                            <ChooseOneQuestion question={currentQuestion} onAnswer={handleAnswer} />
                        )}
                        {currentQuestion.questionType === 2 && (
                            <ChooseManyQuestion question={currentQuestion} onAnswer={handleAnswer} />
                        )}
                        {currentQuestion.questionType === 3 && (
                            <TypeAnswerQuestion question={currentQuestion} onAnswer={handleAnswer} />
                        )}
                        {currentQuestion.questionType === 4 && (
                            <MakeMatchQuestion question={currentQuestion} onAnswer={handleAnswer} />
                        )}
                        <div className="block bg-white py-3 px-3 -mx-3 -mb-2 rounded-b-lg flex items-center justify-between"></div>
                        <BigGrayButton onClick={handlePreviousQuestion}>Prethodno pitanje</BigGrayButton>
                        <BigRedButton onClick={handleNextQuestion}>Sljedeće pitanje</BigRedButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;