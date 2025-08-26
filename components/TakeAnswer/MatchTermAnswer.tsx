'use client';

import { CheckCircle, X, XCircle } from "lucide-react";
import { useEffect, useState } from 'react';

import { Answer, Question, QuizTakeQuestion } from '@/component-models/types';

import { get } from '../../services/HttpService';

interface MatchTermAnswerProps {
    questionId: number;
    quizTakeChildren: QuizTakeQuestion[];
}

function MatchTermAnswer({ questionId, quizTakeChildren }: MatchTermAnswerProps) {
    const [questionAnswerDictionary, setQuestionAnswerDictionary] = useState<Map<Question, Answer>>(new Map());
    const [answers, setAnswers] = useState<Answer[]>([]);

    useEffect(() => {
        const fetchQuestionAnswers = async () => {
            try {
                // eslint-disable-next-line max-len
                const childQuestionsResponse = await get(`Quizzes/PublicQuestion/getList/1?parentId=${questionId}&ActiveStatusId=0&QuizCategoryId=0&QuizId=0&QuizTheme=None&QuestionType=None&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=True&PerPage=10`);
                const childQuestions = childQuestionsResponse.data.list;

                const questionAnswerDict = new Map<Question, Answer>();
                const allAnswers: Answer[] = [];

                for (const childQuestion of childQuestions) {
                    // eslint-disable-next-line max-len
                    const answersResponse = await get(`Quizzes/PublicAnswer/GetList?questionId=${childQuestion.id}&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=False&PerPage=10`);
                    const answersData = answersResponse.data.list;
                    if (!questionAnswerDict.has(childQuestion)) {
                        questionAnswerDict.set(childQuestion, answersData[0]);
                    }
                    allAnswers.push(...answersData);
                }

                setQuestionAnswerDictionary(questionAnswerDict);
                setAnswers(allAnswers);
            } catch (error) {
                console.error('Error fetching question answers:', error);
            }
        };

        fetchQuestionAnswers();
    }, [questionId]);

    return (
        <div className="space-y-6">
            {Array.from(questionAnswerDictionary.entries()).map(([question, correctAnswer]: [Question, Answer], index) => {
                const questionTake = quizTakeChildren.find(x => x.questionId === question.id);
                const answer = questionTake?.answers[0];

                return (
                    <div key={index} className="space-y-4">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <p className="text-base font-medium text-foreground">{question.text}</p>
                                </div>
                            </div>
                            <div>
                                {answer ? (
                                    answer.isCorrect ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                <p className="font-semibold text-lg text-green-700 dark:text-green-300">
                                                    Točan odgovor!
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-3 p-4 border-2 border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20 rounded-lg">
                                                <span className="text-base font-medium text-green-700 dark:text-green-300">
                                                    {correctAnswer.text}
                                                </span>
                                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {answers.find(x => x.id === answer.id)?.text ? (
                                                <>
                                                    <p className="font-semibold text-lg text-foreground">Tvoj odgovor:</p>
                                                    <div className="flex items-center space-x-3 p-4 border-2 border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20 rounded-lg">
                                                        <span className="text-base font-medium text-red-700 dark:text-red-300">
                                                            {answers.find(x => x.id === answer.id)?.text}
                                                        </span>
                                                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                                    </div>
                                                    <p className="font-semibold text-lg text-foreground">Točan odgovor:</p>
                                                    <div className="flex items-center space-x-3 p-4 border-2 border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20 rounded-lg">
                                                        <span className="text-base font-medium text-green-700 dark:text-green-300">
                                                            {correctAnswer.text}
                                                        </span>
                                                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                                        <X className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                                        <p className="font-medium text-yellow-800 dark:text-yellow-200">
                                                            Nisi odgovorio!
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold text-lg text-foreground">Točan odgovor:</p>
                                                    <div className="flex items-center space-x-3 p-4 border-2 border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20 rounded-lg">
                                                        <span className="text-base font-medium text-green-700 dark:text-green-300">
                                                            {correctAnswer.text}
                                                        </span>
                                                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                            <X className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                            <p className="font-medium text-yellow-800 dark:text-yellow-200">
                                                Nisi odgovorio!
                                            </p>
                                        </div>
                                        <p className="font-semibold text-lg text-foreground">Točan odgovor:</p>
                                        <div className="flex items-center space-x-3 p-4 border-2 border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20 rounded-lg">
                                            <span className="text-base font-medium text-green-700 dark:text-green-300">
                                                {correctAnswer.text}
                                            </span>
                                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default MatchTermAnswer;