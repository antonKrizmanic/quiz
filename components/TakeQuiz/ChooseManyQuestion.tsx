import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import React, { useEffect } from 'react';

import { QuizAnswerOption, QuizQuestionDetail } from '@/component-models/types';

import QuestionHeader from '../reusable/QuestionHeader';

interface ChooseManyQuestionProps {
    question: Pick<QuizQuestionDetail, 'id' | 'text' | 'answers'>;
    questionIndex: number;
    questionCount: number;
    onAnswer: (questionId: number, answers: QuizAnswerOption[]) => void;
    initialAnswers?: QuizAnswerOption[];
}

function ChooseManyQuestion({ question, questionIndex, questionCount, onAnswer, initialAnswers }: ChooseManyQuestionProps) {
    const [selectedAnswers, setSelectedAnswers] = React.useState<QuizAnswerOption[]>([]);

    useEffect(() => {
        if (initialAnswers) {
            setSelectedAnswers(initialAnswers);
        }
    }, [initialAnswers]);


    const handleChange = (answerId: number, checked: boolean) => {
        const answers = [...selectedAnswers];
        if (checked) {
            const selectedAnswer = question.answers.find((answer) => answer.id === answerId);
            if (selectedAnswer) {
                answers.push(selectedAnswer);
            }
        } else {
            const index = answers.findIndex((answer) => answer.id === answerId);
            if (index > -1) {
                answers.splice(index, 1);
            }
        }
        setSelectedAnswers(answers);
        onAnswer(question.id, answers);
    };

    return (
        <div className="space-y-8">
            <QuestionHeader
                questionIndex={questionIndex}
                questionCount={questionCount}
                questionText={question.text}
                helperText="(Odaberi više odgovora)" />
            <div className="space-y-4">
                {question.answers.map((option) => {
                    const isChecked = selectedAnswers.some((answer) => answer.id === option.id);
                    return (
                        <div key={option.id} className="group">
                            <Checkbox
                                id={`checkbox-${option.id}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => handleChange(option.id, checked as boolean)}
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor={`checkbox-${option.id}`}
                                className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:border-primary-300 dark:hover:border-primary-400 hover:shadow-md ${isChecked
                                    ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                                    : 'border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                <div className={`flex-shrink-0 w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all duration-300 ${isChecked
                                    ? 'border-primary-600 dark:border-primary-400 bg-primary-600 dark:bg-primary-400'
                                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                    }`}>
                                    {isChecked && (
                                        <Check className="w-4 h-4 text-red-600" />
                                    )}
                                </div>
                                <span className={`text-base font-medium transition-colors ${isChecked
                                    ? 'text-primary-700 dark:text-primary-300'
                                    : 'text-slate-700 dark:text-slate-200'
                                    }`}>
                                    {option.text}
                                </span>
                            </Label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ChooseManyQuestion;