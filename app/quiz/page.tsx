'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import UserInfo from '@/components/TakeQuiz/UserInfo';
import TypeAnswerQuestion from '@/components/TakeQuiz/TypeAnswerQuestion';
import MakeMatchQuestion from '@/components/TakeQuiz/MakeMatchQuestion';
import ChooseOneQuestion from '@/components/TakeQuiz/ChooseOneQuestion';
import ChooseManyQuestion from '@/components/TakeQuiz/ChooseManyQuestion';
import LoadingContainer from '@/components/LoadingContainer/LoadingContainer';

import { get, post } from '../../services/HttpService';



// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    questionType: number;
    parentId: number | null;
    children: Question[] | null;
    answers: Answer[];
}

interface QuizDetail {
    questions: Question[];
}

function Quiz() {
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
                if(question.questionType === 4) {
                    questionAnswers = answers[question.id];
                }
                else{
                    if(Array.isArray(answers[question.id])){
                        questionAnswers = answers[question.id].map((answer: Answer) => {
                            return {
                                questionId: question.id,
                                answerId: answer.id,
                                text: answer.text,
                                parentQuestionId: question.parentId
                            };
                        });
                    }
                    else{
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
        router.push(`/take-result?take-id=${response.data}`);
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!quiz || quiz.questions.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="body1">Nažalost, ovaj kviz nema ni jedno pitanje, odaberite drugi</Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={handleBack} variant="outlined"><FontAwesomeIcon icon={faArrowLeft} /> &nbsp; Natrag</Button>
                </CardActions>
            </Card>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <Card sx={{width:'100%'}}>
            <CardContent>
                {showUserInfo && (
                    <UserInfo onBack={handlePreviousQuestion} onSubmit={submitQuiz} />
                )}
                {!showUserInfo && currentQuestion.questionType === 1 && (
                    <ChooseOneQuestion question={currentQuestion}
                        questionIndex={currentQuestionIndex}
                        onAnswer={handleSingleAnswer}
                        initialAnswers={answers[currentQuestion.id]} />
                )}
                {!showUserInfo && currentQuestion.questionType === 2 && (
                    <ChooseManyQuestion question={currentQuestion}
                        questionIndex={currentQuestionIndex}
                        onAnswer={handleMultipleAnswer}
                        initialAnswers={answers[currentQuestion.id]} />
                )}
                {!showUserInfo && currentQuestion.questionType === 3 && (
                    <TypeAnswerQuestion question={currentQuestion}
                        questionIndex={currentQuestionIndex}
                        onAnswer={handleTextAnswer}
                        initialAnswer={answers[currentQuestion.id]?.text} />
                )}
                {!showUserInfo && currentQuestion.questionType === 4 && (
                    <MakeMatchQuestion question={currentQuestion}
                        questionIndex={currentQuestionIndex}
                        onAnswer={handleAnswer}
                        initialAnswer={answers[currentQuestion.id]} />
                )}
            </CardContent>
            {!showUserInfo && (
                <CardActions sx={{justifyContent: 'space-between'}}>
                    <Button onClick={handlePreviousQuestion}
                        disabled={!enablePrevious}
                        variant="outlined"><FontAwesomeIcon icon={faArrowLeft} />&nbsp;Prethodno pitanje</Button>
                    <Button onClick={handleNextQuestion}
                        disabled={!enableNext}
                        variant="outlined">Sljedeće pitanje&nbsp;<FontAwesomeIcon icon={faArrowRight} /></Button>
                </CardActions>
            )}
        </Card>
    );
}

function QuizPage() {
    return (
        <Suspense fallback={<LoadingContainer isLoading={true} />}>
            <Quiz />
        </Suspense>
    );
}

export default QuizPage;