import React, { useEffect, useState } from 'react';
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';


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
  onAnswer: (questionId: number, answer: Answer) => void;
  initialAnswer?: Answer;
}

function ChooseOneQuestion({ question, questionIndex, onAnswer, initialAnswer }:ChooseOneQuestionProps) {
    const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);

    useEffect(() => {
        if (initialAnswer) {
            setSelectedAnswerId(initialAnswer.id);
        }
    }, [initialAnswer]);

    const onAnswerSelect = (answerId: number) => {
        const selectedAnswer = question.answers.find((answer) => answer.id === answerId);
        if (selectedAnswer) {
            setSelectedAnswerId(answerId);
            onAnswer(question.id, selectedAnswer);
        }
    };

    return (
        <>
            <Box sx={{ marginBottom: '16px' }}>
                <Typography
                    variant="subtitle1"
                    sx={{ lineHeight: 1, fontWeight: 600 }}>
                    {questionIndex + 1}. {question.text}</Typography>
                <Typography
                    variant="caption">
          (Odaberi samo jedan odgovor)
                </Typography>
            </Box>
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
                                control={<Radio checked={selectedAnswerId === option.id}/>}
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