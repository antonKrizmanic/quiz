'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { get, post } from '../../services/HttpService';
import BigRedButton from '@/components/Buttons/BigRedButton';
import BigGrayButton from '@/components/Buttons/BigGrayButton';
import ChooseOneQuestion from '@/components/TakeQuiz/ChooseOneQuestion';
import ChooseManyQuestion from '@/components/TakeQuiz/ChooseManyQuestion';
import TypeAnswerQuestion from '@/components/TakeQuiz/TypeAnswerQuestion';
import MakeMatchQuestion from '@/components/TakeQuiz/MakeMatchQuestion';
import UserInfo from '@/components/TakeQuiz/UserInfo';

interface QuizTakeDto {
    quizId: number;
    startedAt: string;
    endedAt: string;
    takeUserName: string;
    takeUserType: number;
    questions: QuizTakeQuestionDto[];
    cityAssociationId: number;
}
  
  interface QuizTakeQuestionDto {
    id: number;
    questionId: number;
    index: number;
    parentId?: number | null;
    answers: QuizTakeAnswerDto[];
}
  

interface QuizTakeAnswerDto {
    questionId: number;
    answerId: number;
    parentId?: number;
    text: string;
}

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
    const [showUserInfo, setShowUserInfo] = useState<boolean>(false);
    const [quiz, setQuiz] = useState<QuizDetail | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [answers, setAnswers] = useState<any>({});
    const [enablePrevious, setEnablePrevious] = useState<boolean>(false);
    const [enableNext, setEnableNext] = useState<boolean>(false);

    useEffect(() => {
        const fetchQuizDetails = async () => {
            try {
                const response = await get(`quizzes/PublicQuiz/GetDetail/${quizId}`);
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

    useEffect(() => {
        if (currentQuestionIndex === 0) {
            setEnablePrevious(false);
        } else {
            setEnablePrevious(true);
        }
        
        const currentQuestionId = quiz?.questions[currentQuestionIndex]?.id;
        if (currentQuestionId && answers[currentQuestionId]) {
            setEnableNext(true);
        } else {
            setEnableNext(false);
        }
    }, [currentQuestionIndex, quiz, answers]);

    const handleNextQuestion = () => {
        setEnableNext(false);
        if (currentQuestionIndex < quiz!.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowUserInfo(true);
        }
    };

    const handlePreviousQuestion = () => {
        if(showUserInfo) { setShowUserInfo(false); return; }
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }        
    };

    const handleBack = () => {
        router.back();
    };

    const handleSingleAnswer = (questionId: number, answer: Answer) => {
        setEnableNext(true);
        const updatedAnswers = {
            ...answers,
            [questionId]: answer,
        };
        setAnswers(updatedAnswers);
    }

    const handleMultipleAnswer = (questionId: number, givenAnswers: Answer[]) => {
        setEnableNext(true);
        const updatedAnswers = {
            ...answers,
            [questionId]: givenAnswers,
        };
        setAnswers(updatedAnswers);
    }

    const handleTextAnswer = (questionId: number, answerText: string) => {
        setEnableNext(true);
        const answer = {
            id: 0,
            text: answerText,
            questionId: questionId,
        };
        const updatedAnswers = {
            ...answers,
            [questionId]: answer,
        };
        setAnswers(updatedAnswers);
    }

    const handleAnswer = (questionId: number, answer: QuizTakeAnswerDto[]) => {
        console.log('handle anser', answer);
        setEnableNext(true);        
        const updatedAnswers = {
            ...answers,
            [questionId]: answer,
        };
        setAnswers(updatedAnswers);      
    };

    const submitQuiz = async (name: string, role: string) => {
        const quizTakeDto = {
            quizId: parseInt(quizId!),
            startedAt: "2024-10-09T18:21:56.337+02:00",
            endedAt: "2024-10-09T18:21:56.337+02:00",
            takeUserName: name,
            takeUserType: parseInt(role),
            questions: Object.keys(quiz.questions).map((key, index) => {
                const question = quiz.questions[key];
                const answer = answers[question.id];                
                const quizTakeQuestionDto: QuizTakeQuestionDto = {
                    id: 0,
                    questionId: question.id,
                    index: index,
                    parentId: question.parentId,
                    answers: Array.isArray(answer) ? answer : [answer],
                };
                return quizTakeQuestionDto;
            }),
            cityAssociationId: 1
        };
        const response = await post(`quizzes/PublicQuizTake`, quizTakeDto);
        console.log(response.data);
        router.push(`/take-result?take-id=${response.data}`);
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
                        {showUserInfo && (
                            <UserInfo onBack={handlePreviousQuestion} onSubmit={submitQuiz}/>
                        )}
                        {!showUserInfo && currentQuestion.questionType === 1 && (
                            <ChooseOneQuestion question={currentQuestion} questionIndex={currentQuestionIndex} onAnswer={handleSingleAnswer} initialAnswer={answers[currentQuestion.id]}/>
                        )}
                        {!showUserInfo && currentQuestion.questionType === 2 && (
                            <ChooseManyQuestion question={currentQuestion} questionIndex={currentQuestionIndex} onAnswer={handleMultipleAnswer} initialAnswers={answers[currentQuestion.id]}/>
                        )}
                        {!showUserInfo && currentQuestion.questionType === 3 && (
                            <TypeAnswerQuestion question={currentQuestion} questionIndex={currentQuestionIndex} onAnswer={handleTextAnswer} initialAnswer={answers[currentQuestion.id]?.text}/>
                        )}
                        {!showUserInfo && currentQuestion.questionType === 4 && (
                            <MakeMatchQuestion question={currentQuestion} questionIndex={currentQuestionIndex} onAnswer={handleAnswer} initialAnswer={answers[currentQuestion.id]}/>
                        )}
                        {!showUserInfo && (
                            <div className="block bg-white py-3 px-3 -mx-3 -mb-2 rounded-b-lg flex items-center justify-between">
                                <BigGrayButton disabled={!enablePrevious} onClick={handlePreviousQuestion}>Prethodno pitanje</BigGrayButton>
                                <BigRedButton disabled={!enableNext} onClick={handleNextQuestion}>Sljedeće pitanje</BigRedButton>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;