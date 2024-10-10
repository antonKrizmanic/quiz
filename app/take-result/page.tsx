'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { get } from '../../services/HttpService';
import BigRedButton from '@/components/Buttons/BigRedButton';
import TextInputAnswer from '@/components/TakeAnswer/TextInputAnswer';
import SingleSelectAnswer from '@/components/TakeAnswer/SingleSelectAnswer';
import MultiSelectAnswer from '@/components/TakeAnswer/MultiSelectAnswer';
import MatchTermAnswer from '@/components/TakeAnswer/MatchTermAnswer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

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

interface QuestionViewModel {
    id: number;
    text: string;
    isActiveDescription: string;
    quizCategoryName: string;
    quizCategoryId: number;
    questionType: number;
    isEditable: boolean;
    isDeletable: boolean;
}



const TakeResultPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const takeId = searchParams.get('take-id');
    const [loading, setLoading] = useState<boolean>(true);
    const [results, setResults] = useState<QuizTakeDetailViewModel[]>([]);
    const [questions, setQuestions] = useState<QuestionViewModel[]>([]);
    const [questionDictionary, setQuestionDictionary] = useState<Map<QuizTakeQuestionViewModel, QuestionViewModel>>(new Map());

    useEffect(() => {
        const fetchResults = async () => {
            if (!takeId) return;

            try {
                const response = await get(`quizzes/PublicQuizTake/Get/${takeId}`);
                const resultData = response.data;
                setResults(resultData);

                const quizId = response.data.quizId;
                const loadedQuestions = await get(`quizzes/PublicQuestion/GetList/1?ParentId=0&ActiveStatusId=0&QuizCategoryId=0&QuizId=${quizId}&QuizTheme=None&QuestionType=None&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=True&PerPage=10`);
                const questionData = loadedQuestions.data.list;
                setQuestions(questionData);

                const questionDict = new Map();
                resultData.quizTakeQuestions.sort((a, b) => a.index - b.index).forEach(takeQuestion => {
                    const quizQuestion = questionData.find(q => q.id === takeQuestion.questionId);
                    if (!questionDict.has(takeQuestion)) {
                        questionDict.set(takeQuestion, quizQuestion);
                    }
                });
                setQuestionDictionary(questionDict);

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
                            <p className="mb-3 text-center">Nije pronađen rezultat za ovaj kviz.</p>
                            <BigRedButton onClick={() => router.back()}>
                            <FontAwesomeIcon icon={faArrowLeft} /> Natrag
                            </BigRedButton>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <h1 className="text-3xl text-center font-bold px-2 mb-2">
                Tvoj rezultat je {results.score}/{results.questionNumber}
            </h1>
            <div className="w-full max-w-screen-md mx-auto px-6">
                <div className="flex flex-col justify-center">
                    <div className="w-full">
                        <div className="bg-white shadow-md rounded-lg px-3 py-2 mb-4 pb-4">
                        {Array.from(questionDictionary.entries()).map(([takeQuestion, question], index) => {
                                const cssClass = takeQuestion.isCorrect ? 'bg-green-100' : 'bg-red-100';
                                const fullCssClass = `flex mb-4 ${cssClass}`;

                                let questionContent;
                                switch (question.questionType) {                                    
                                    case 1:
                                        questionContent = <SingleSelectAnswer givenAnswer={takeQuestion.answers[0]} questionId={question.id} />;
                                        break;
                                    case 2:
                                        questionContent = <MultiSelectAnswer givenAnswers={takeQuestion.answers} questionId={question.id} />;
                                        break;
                                    case 3:
                                        questionContent = <TextInputAnswer givenAnswer={takeQuestion.answers[0]} questionId={question.id} />;
                                        break;
                                    case 4:
                                        questionContent = <MatchTermAnswer quizTakeChildren={takeQuestion.children} questionId={question.id} />;
                                        break;
                                    default:
                                        questionContent = <p>Nepoznata vrsta pitanja</p>;
                                }

                                return (
                                    <div key={index} className={fullCssClass}>
                                        <div className="w-auto text-grey-100 items-center p-4">
                                            <p className="text-lg font-semibold">{takeQuestion.index + 1}. {question.text}</p>
                                            {questionContent}
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="text-center">
                                <BigRedButton onClick={() => router.push('/')}>
                                    <FontAwesomeIcon icon={faArrowLeft} /> &nbsp;
                                    Natrag na početnu stranicu
                                </BigRedButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TakeResultPage;