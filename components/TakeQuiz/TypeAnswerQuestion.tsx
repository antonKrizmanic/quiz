import React, { useEffect, useState } from 'react';
import { Box, TextField } from '@mui/material';
import QuestionHeader from '../reusable/QuestionHeader';

interface TypeAnswerQuestionProps {
    question: {
        id: number;
        text: string;
    };
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
        <>   
            <QuestionHeader questionIndex={questionIndex} questionCount={questionCount} questionText={question.text} helperText="(Upiši točan odgovor)" />                                             
            <Box>
                <TextField
                    variant="outlined"
                    value={answer}
                    onChange={handleChange}
                    size="small"
                    fullWidth />
            </Box>
        </>
    );
}

export default TypeAnswerQuestion;