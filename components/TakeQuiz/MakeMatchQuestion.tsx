import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "lucide-react";
import { useEffect, useState } from 'react';

import { QuizAnswerOption, QuizQuestionDetail, QuizTakeAnswerDto } from '@/types/quiz';

import QuestionHeader from '../reusable/QuestionHeader';

interface MakeMatchQuestionProps {
    question: QuizQuestionDetail;
    questionIndex: number;
    questionCount: number;
    onAnswer: (questionId: number, answer: QuizTakeAnswerDto[]) => void;
    initialAnswer?: QuizTakeAnswerDto[];
}

function MakeMatchQuestion({ question, questionIndex, questionCount, onAnswer, initialAnswer }: MakeMatchQuestionProps) {
    const [possibleAnswers, setPossibleAnswers] = useState<QuizAnswerOption[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<QuizTakeAnswerDto[]>([]);

    useEffect(() => {
        const answers = (question.children ?? []).flatMap((child) => child.answers);
        setPossibleAnswers(answers);

        if (initialAnswer) {
            setSelectedAnswers(initialAnswer);
        }
    }, [question, initialAnswer]);

    const handleSelectChange = (childId: number, answerId: string) => {
        const numericAnswerId = parseInt(answerId);
        const selectedOption = possibleAnswers.find((option) => option.id === numericAnswerId);
        const answer: QuizTakeAnswerDto = {
            questionId: childId,
            answerId: numericAnswerId,
            parentId: question.id,
            text: selectedOption?.text ?? ''
        };

        const answersArray = [...selectedAnswers];
        const index = answersArray.findIndex((a) => a.questionId === childId);
        if (index > -1) {
            answersArray[index] = answer;
        } else {
            answersArray.push(answer);
        }
        setSelectedAnswers(answersArray);
        onAnswer(question.id, answersArray);
    };

    return (
        <div className="space-y-8">
            <QuestionHeader
                questionIndex={questionIndex}
                questionCount={questionCount}
                questionText={question.text}
                helperText="(Spoji odgovarajuće pojmove)" />
            <div className="space-y-6">
                {question.children?.map((child, index) => (
                    <div key={child.id} className="group">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                        {index + 1}
                                    </span>
                                </div>
                                <Label htmlFor={`select-${child.id}`} className="text-lg font-medium text-foreground">
                                    {child.text}
                                </Label>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Link className="h-5 w-5 text-slate-400" />
                                </div>
                                <Select
                                    value={selectedAnswers.find((a) => a.questionId === child.id)?.answerId?.toString() || ""}
                                    onValueChange={(value) => handleSelectChange(child.id, value)}
                                >
                                    <SelectTrigger className="w-full pl-10 py-4 text-lg border-2 border-slate-200 dark:border-slate-700 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600">
                                        <SelectValue placeholder="Odaberite odgovor..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {possibleAnswers.map((answer) => (
                                            <SelectItem key={answer.id} value={answer.id.toString()}>
                                                {answer.text}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-sm text-muted-foreground text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                <p>Spojite svaki pojam s odgovarajućim odgovorom iz padajućeg izbornika</p>
            </div>
        </div>
    );
}

export default MakeMatchQuestion;