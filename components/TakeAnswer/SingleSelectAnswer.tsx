'use client';

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, X, XCircle } from "lucide-react";
import { useEffect, useState } from 'react';

import { Answer } from '@/component-models/types';

import { get } from '../../services/HttpService';

interface SingleSelectAnswerProps {
    givenAnswer?: Answer;
    questionId: number;
}

function SingleSelectAnswer({ givenAnswer, questionId }: SingleSelectAnswerProps) {
    const [answers, setAnswers] = useState<Answer[]>([]);

    useEffect(() => {
        const fetchAnswers = async () => {
            // eslint-disable-next-line max-len
            const response = await get(`Quizzes/publicAnswer/GetList?QuestionId=${questionId}&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=True&PerPage=10`);
            setAnswers(response.data.list);
        };
        fetchAnswers();
    }, [givenAnswer, questionId]);

    return (
        <div className="space-y-4">
            {!givenAnswer ? (
                <div className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <X className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                        Na ovo pitanje nije odgovoreno!
                    </p>
                </div>
            ) : null}
            <RadioGroup
                value={givenAnswer?.id?.toString() || ""}
                className="space-y-3"
                disabled
            >
                {answers.map((answer) => {
                    const isSelected = givenAnswer && answer.id === givenAnswer.id;
                    const isCorrect = answer.isCorrect;
                    const isWrong = givenAnswer && !answer.isCorrect && answer.id === givenAnswer.id;

                    return (
                        <div key={answer.id} className="group">
                            <RadioGroupItem
                                value={answer.id.toString()}
                                id={`answer-${answer.id}`}
                                checked={isSelected}
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor={`answer-${answer.id}`}
                                className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-default transition-all duration-300 ${isCorrect
                                    ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                                    : isWrong
                                        ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                                        : 'border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                <div className={`flex-shrink-0 w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${isCorrect
                                    ? 'border-green-600 dark:border-green-400 bg-green-600 dark:bg-green-400'
                                    : isWrong
                                        ? 'border-red-600 dark:border-red-400 bg-red-600 dark:bg-red-400'
                                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                    }`}>
                                    {isSelected && (
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                    )}
                                </div>
                                <span className={`text-base font-medium transition-colors ${isCorrect
                                    ? 'text-green-700 dark:text-green-300'
                                    : isWrong
                                        ? 'text-red-700 dark:text-red-300'
                                        : 'text-slate-700 dark:text-slate-200'
                                    }`}>
                                    {answer.text}
                                </span>
                                {isCorrect && (
                                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                )}
                                {isWrong && (
                                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                )}
                            </Label>
                        </div>
                    );
                })}
            </RadioGroup>
        </div>
    );
}

export default SingleSelectAnswer;