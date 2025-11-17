'use client';

import { CheckCircle, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { Answer } from '@/types/quiz';

import { get } from '../../services/HttpService';

interface TextInputAnswerProps {
    givenAnswer?: Answer;
    questionId: number;
}

function TextInputAnswer({ givenAnswer, questionId }: TextInputAnswerProps) {
    const [answers, setAnswers] = useState<Answer[]>([]);

    useEffect(() => {
        const fetchAnswers = async () => {
            // eslint-disable-next-line max-len
            const response = await get(
                `Quizzes/PublicAnswer/GetList?QuestionId=${questionId}&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=True&PerPage=10`,
            );
            setAnswers(response.data.list);
        };

        fetchAnswers();
    }, [questionId]);

    return (
        <div className="space-y-6">
            {!givenAnswer || !givenAnswer.text ? (
                <div className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <X className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                        Nisi odgovorio!
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    <p className="font-semibold text-lg text-foreground">
                        Tvoj odgovor:
                    </p>
                    <div
                        className={`flex items-center space-x-3 p-4 border-2 rounded-lg ${
                            givenAnswer.isCorrect
                                ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                                : 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                        }`}
                    >
                        <span
                            className={`text-base font-medium ${
                                givenAnswer.isCorrect
                                    ? 'text-green-700 dark:text-green-300'
                                    : 'text-red-700 dark:text-red-300'
                            }`}
                        >
                            {givenAnswer.text}
                        </span>
                        {givenAnswer.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                        )}
                    </div>
                </div>
            )}

            <div className="space-y-3">
                <p className="font-semibold text-lg text-foreground">
                    Odgovori koji se priznaju:
                </p>
                <div className="space-y-2">
                    {answers.map((correctAnswer, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg"
                        >
                            <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                    {index + 1}
                                </span>
                            </div>
                            <span className="text-base text-slate-700 dark:text-slate-200">
                                {correctAnswer.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TextInputAnswer;
