import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Brain, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import ChooseManyQuestion from '@/components/TakeQuiz/ChooseManyQuestion';
import ChooseOneQuestion from '@/components/TakeQuiz/ChooseOneQuestion';
import MakeMatchQuestion from '@/components/TakeQuiz/MakeMatchQuestion';
import TypeAnswerQuestion from '@/components/TakeQuiz/TypeAnswerQuestion';
import UserInfo from '@/components/TakeQuiz/UserInfo';

import { get, post } from '../../services/HttpService';

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
    questionType: number;
    parentId: number | null;
    children: Question[] | null;
    answers: Answer[];
}

interface QuizDetail {
    questions: Question[];
}

export default function QuizView() {
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
    const [startedAt, setStartedAt] = useState<Date>();

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
            setStartedAt(new Date());
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
        if (showUserInfo) { setShowUserInfo(false); return; }
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
            [questionId]: [answer]
        };
        setAnswers(updatedAnswers);
    };

    const handleMultipleAnswer = (questionId: number, givenAnswers: Answer[]) => {
        setEnableNext(true);
        const updatedAnswers = {
            ...answers,
            [questionId]: givenAnswers
        };
        setAnswers(updatedAnswers);
    };

    const handleTextAnswer = (questionId: number, answerText: string) => {
        setEnableNext(true);
        const answer = {
            id: 0,
            text: answerText,
            questionId: questionId
        };
        const updatedAnswers = {
            ...answers,
            [questionId]: answer
        };
        setAnswers(updatedAnswers);
    };

    const handleAnswer = (questionId: number, answer: QuizTakeAnswerDto[]) => {
        setEnableNext(true);
        const updatedAnswers = {
            ...answers,
            [questionId]: answer
        };
        setAnswers(updatedAnswers);
    };

    const submitQuiz = async (name: string, role: string) => {
        const quizTakeDto = {
            quizId: parseInt(quizId!),
            startedAt: startedAt,
            endedAt: new Date(),
            takeUserName: name,
            takeUserType: parseInt(role),
            questions: Object.keys(quiz.questions).map((key, index) => {
                const question = quiz.questions[key];
                let questionAnswers = [];
                if (question.questionType === 4) {
                    questionAnswers = answers[question.id];
                }
                else {
                    if (Array.isArray(answers[question.id])) {
                        questionAnswers = answers[question.id].map((answer: Answer) => {
                            return {
                                questionId: question.id,
                                answerId: answer.id,
                                text: answer.text,
                                parentQuestionId: question.parentId
                            };
                        });
                    }
                    else {
                        questionAnswers = [{
                            questionId: question.id,
                            answerId: answers[question.id].id,
                            text: answers[question.id].text,
                            parentQuestionId: question.parentId
                        }];
                    }
                }
                const quizTakeQuestionDto: QuizTakeQuestionDto = {
                    id: 0,
                    questionId: question.id,
                    index: index,
                    parentId: question.parentId,
                    answers: questionAnswers
                };
                return quizTakeQuestionDto;
            }),
            cityAssociationId: 1
        };
        const response = await post('quizzes/PublicQuizTake', quizTakeDto);
        router.push(`/result?take-id=${response.data}`);
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <Loader2 className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    if (!quiz || quiz.questions.length === 0) {
        return (
            <div className="space-y-8 mb-12">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                        <Brain className="h-8 w-8 text-destructive" />
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">Kviz nije dostupan</h2>
                    <p className="text-muted-foreground">Nažalost, ovaj kviz nema ni jedno pitanje, odaberite drugi</p>
                </div>
                <Card className="w-full">
                    <CardFooter className="flex justify-center pt-6">
                        <Button
                            onClick={handleBack}
                            variant="outline"
                            className="group relative overflow-hidden bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-600 border-2 border-slate-200 dark:border-slate-600 hover:border-primary-300 dark:hover:border-primary-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300 group-hover:-translate-x-1" />
                                    <div className="absolute inset-0 bg-primary-100 dark:bg-primary-900 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                                </div>
                                <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300">
                                    Natrag
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <div className="space-y-8 mb-12">
            {/* Progress Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                    <Brain className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                        Pitanje {currentQuestionIndex + 1} od {quiz.questions.length}
                    </h1>
                    <div className="w-full max-w-md mx-auto bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Question Card */}
            <Card className="w-full group hover:shadow-lg transition-all duration-300 border-2 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-400">
                <CardContent className="pt-8 pb-6">
                    {showUserInfo && (
                        <UserInfo onBack={handlePreviousQuestion} onSubmit={submitQuiz} />
                    )}
                    {!showUserInfo && currentQuestion.questionType === 1 && (
                        <ChooseOneQuestion question={currentQuestion}
                            questionIndex={currentQuestionIndex}
                            questionCount={quiz.questions.length}
                            onAnswer={handleSingleAnswer}
                            initialAnswers={answers[currentQuestion.id]} />
                    )}
                    {!showUserInfo && currentQuestion.questionType === 2 && (
                        <ChooseManyQuestion question={currentQuestion}
                            questionIndex={currentQuestionIndex}
                            questionCount={quiz.questions.length}
                            onAnswer={handleMultipleAnswer}
                            initialAnswers={answers[currentQuestion.id]} />
                    )}
                    {!showUserInfo && currentQuestion.questionType === 3 && (
                        <TypeAnswerQuestion question={currentQuestion}
                            questionIndex={currentQuestionIndex}
                            questionCount={quiz.questions.length}
                            onAnswer={handleTextAnswer}
                            initialAnswer={answers[currentQuestion.id]?.text} />
                    )}
                    {!showUserInfo && currentQuestion.questionType === 4 && (
                        <MakeMatchQuestion question={currentQuestion}
                            questionIndex={currentQuestionIndex}
                            questionCount={quiz.questions.length}
                            onAnswer={handleAnswer}
                            initialAnswer={answers[currentQuestion.id]} />
                    )}
                </CardContent>
                {!showUserInfo && (
                    <CardFooter className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-6 border-t border-border">
                        <Button
                            onClick={handlePreviousQuestion}
                            disabled={!enablePrevious}
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-600 border-2 border-slate-200 dark:border-slate-600 hover:border-primary-300 dark:hover:border-primary-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300 group-hover:-translate-x-1" />
                                    <div className="absolute inset-0 bg-primary-100 dark:bg-primary-900 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                                </div>
                                <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300">
                                    Prethodno pitanje
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </Button>
                        <Button
                            onClick={handleNextQuestion}
                            disabled={!enableNext}
                            variant="outline"
                            size="lg"
                            className={`w-full sm:w-auto text-lg py-6 md:py-3 sm:text-sm group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none ${enableNext
                                ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-800/30 dark:hover:to-emerald-700/30 border-2 border-emerald-300 dark:border-emerald-600 hover:border-emerald-400 dark:hover:border-emerald-500'
                                : 'bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-600 border-2 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <span className={`font-medium transition-colors duration-300 ${enableNext
                                    ? 'text-emerald-700 dark:text-emerald-300 group-hover:text-emerald-800 dark:group-hover:text-emerald-200'
                                    : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-800 dark:group-hover:text-slate-100'
                                    }`}>
                                    Sljedeće pitanje
                                </span>
                                <div className="relative">
                                    <ArrowRight className={`h-5 w-5 transition-all duration-300 group-hover:translate-x-1 ${enableNext
                                        ? 'text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300'
                                        : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                                        }`} />
                                    <div className={`absolute inset-0 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10 ${enableNext
                                        ? 'bg-emerald-200 dark:bg-emerald-700'
                                        : 'bg-slate-200 dark:bg-slate-700'
                                        }`}></div>
                                </div>
                            </div>
                            <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-transparent translate-x-full group-hover:-translate-x-full transition-transform duration-700 ${enableNext
                                ? 'via-emerald-100/20 dark:via-emerald-700/20'
                                : 'via-slate-100/20 dark:via-slate-700/20'
                                }`}></div>
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}