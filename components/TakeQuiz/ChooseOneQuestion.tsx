import React, { useEffect, useState } from 'react';
import { Box, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

import QuestionHeader from '../reusable/QuestionHeader';

interface Answer {
    id: number;
    text: string;
    questionId: number;
}

interface ChooseOneQuestionProps {
    question: {
        id: number;
        text: string;
        answers: Answer[];
    };
    questionIndex: number;
    questionCount: number;
    onAnswer: (questionId: number, answer: Answer) => void;
    initialAnswers?: Answer[];
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
        <>
            <QuestionHeader
                questionIndex={questionIndex}
                questionCount={questionCount}
                questionText={question.text}
                helperText="(Odaberi samo jedan odgovor)" />
            <Box>
                <FormControl>
                    <RadioGroup
                        aria-labelledby="radio-buttons-group-label"
                        name="radio-buttons-group"
                    >
                        {question.answers.map((option) => (
                            <FormControlLabel
                                key={option.id}
                                value={option.id}
                                control={<Radio checked={selectedAnswerId === option.id} />}
                                onChange={() => onAnswerSelect(option.id)}
                                label={option.text} />
                        ))}
                    </RadioGroup>
                </FormControl>
            </Box>
        </>
    );
}

export default ChooseOneQuestion;