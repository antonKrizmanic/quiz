import { Input } from "@/components/ui/input";
import { PenTool } from "lucide-react";
import React, { useEffect, useState } from 'react';

import { QuizQuestionDetail } from '@/component-models/types';

import QuestionHeader from '../reusable/QuestionHeader';

interface TypeAnswerQuestionProps {
    question: Pick<QuizQuestionDetail, 'id' | 'text'>;
    questionIndex: number;
    questionCount: number;
    onAnswer: (questionId: number, answer: string) => void;
    initialAnswer?: string;
}

function TypeAnswerQuestion({ question, questionIndex, questionCount, onAnswer, initialAnswer }: TypeAnswerQuestionProps) {
    const [answer, setAnswer] = useState<string>('');

    useEffect(() => {
        if (initialAnswer) {
            setAnswer(initialAnswer);
        }
    }, [initialAnswer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAnswer(value);
        onAnswer(question.id, value);
    };

    return (
        <div className="space-y-8">
            <QuestionHeader
                questionIndex={questionIndex}
                questionCount={questionCount}
                questionText={question.text}
                helperText="(Upiši točan odgovor)" />
            <div className="space-y-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PenTool className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                        type="text"
                        value={answer}
                        onChange={handleChange}
                        placeholder="Upišite svoj odgovor..."
                        className="w-full pl-10 py-4 text-lg border-2 border-slate-200 dark:border-slate-700 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600"
                    />
                </div>
                <div className="text-sm text-muted-foreground text-center">
                    <p>Unesite točan odgovor u polje iznad</p>
                </div>
            </div>
        </div>
    );
}

export default TypeAnswerQuestion;