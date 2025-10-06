import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from 'react';

import { QuizAnswerOption, QuizQuestionDetail } from '@/types/quiz';

import QuestionHeader from '../reusable/QuestionHeader';

interface ChooseOneQuestionProps {
    question: Pick<QuizQuestionDetail, 'id' | 'text' | 'answers'>;
    questionIndex: number;
    questionCount: number;
    onAnswer: (questionId: number, answer: QuizAnswerOption) => void;
    initialAnswers?: QuizAnswerOption[];
}

function ChooseOneQuestion({ question, questionIndex, questionCount, onAnswer, initialAnswers }: ChooseOneQuestionProps) {
    const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);

    useEffect(() => {
        if (initialAnswers) {
            setSelectedAnswerId(initialAnswers[0].id);
        }
    }, [initialAnswers]);

    const onAnswerSelect = (answerId: number) => {
        const selectedAnswer = question.answers.find((answer) => answer.id === answerId);
        if (selectedAnswer) {
            setSelectedAnswerId(answerId);
            onAnswer(question.id, selectedAnswer);
        }
    };

    return (
        <div className="space-y-8">
            <QuestionHeader
                questionIndex={questionIndex}
                questionCount={questionCount}
                questionText={question.text}
                helperText="(Odaberi samo jedan odgovor)" />
            <RadioGroup
                value={selectedAnswerId?.toString() || ""}
                onValueChange={(value) => onAnswerSelect(parseInt(value))}
            >
                {question.answers.map((option) => {
                    const isSelected = selectedAnswerId === option.id;
                    return (
                        <div key={option.id} className="group">
                            <RadioGroupItem
                                value={option.id.toString()}
                                id={`option-${option.id}`}
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor={`option-${option.id}`}
                                className={`flex items-center space-x-2 p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:border-primary-300 dark:hover:border-primary-400 hover:shadow-md ${isSelected
                                    ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                                    : 'border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                <div className={`flex-shrink-0 w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected
                                    ? 'border-primary-600 dark:border-primary-400 bg-primary-600 dark:bg-primary-400'
                                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                    }`}>
                                    {isSelected && (
                                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                                    )}
                                </div>
                                <span className={`text-base font-medium transition-colors ${isSelected
                                    ? 'text-primary-700 dark:text-primary-300'
                                    : 'text-slate-700 dark:text-slate-200'
                                    }`}>
                                    {option.text}
                                </span>
                            </Label>
                        </div>
                    );
                })}
            </RadioGroup>
        </div>
    );
}

export default ChooseOneQuestion;