import React, { useEffect } from 'react';
import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';

import QuestionHeader from '../reusable/QuestionHeader';

interface Answer {
    id: number;
    text: string;
    questionId: number;
}

interface ChooseManyQuestionProps {
    question: {
        id: number;
        text: string;
        answers: Answer[];
    };
    questionIndex: number;
    questionCount: number;
    onAnswer: (questionId: number, answers: Answer[]) => void;
    initialAnswers?: Answer[];
}

function ChooseManyQuestion({ question, questionIndex, questionCount, onAnswer, initialAnswers }: ChooseManyQuestionProps) {
    const [selectedAnswers, setSelectedAnswers] = React.useState<Answer[]>([]);

    useEffect(() => {
        if (initialAnswers) {
            setSelectedAnswers(initialAnswers);
        }
    }, [initialAnswers]);


    const handleChange = (answerId: number) => {
        const answers = [...selectedAnswers];
        const index = answers.findIndex((answer) => answer.id === answerId);
        if (index > -1) {
            answers.splice(index, 1);
        } else {
            const selectedAnswer = question.answers.find((answer) => answer.id === answerId);
            if (selectedAnswer) {
                answers.push(selectedAnswer);
            }
        }
        setSelectedAnswers(answers);
        onAnswer(question.id, answers);
    };

    return (
        <>
            <QuestionHeader
                questionIndex={questionIndex}
                questionCount={questionCount}
                questionText={question.text}
                helperText="(Odaberi više odgovora)" />
            <Box>
                <FormGroup>
                    {question.answers.map((option) => (
                        <FormControlLabel
                            key={option.id}
                            control={<Checkbox checked={selectedAnswers.some((answer) => answer.id === option.id)} />}
                            label={option.text}
                            onChange={() => handleChange(option.id)}
                        />
                    ))}
                </FormGroup>
            </Box>
        </>
    );
}

export default ChooseManyQuestion;