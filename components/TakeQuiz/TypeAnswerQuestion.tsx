import { Box, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface TypeAnswerQuestionProps {
  question: {
    id: number;
    text: string;
  };
  questionIndex: number;
  onAnswer: (questionId: number, answer: string) => void;
  initialAnswer?: string;
}

const TypeAnswerQuestion: React.FC<TypeAnswerQuestionProps> = ({ question, questionIndex, onAnswer, initialAnswer }) => {
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
      <Box sx={{ marginBottom: '16px' }}>
        <Typography
          variant='subtitle1'
          sx={{ lineHeight: 1, fontWeight: 600 }}>
          {questionIndex + 1}. {question.text}</Typography>
        <Typography
          variant='caption'>
          (Upiši točan odgovor)
        </Typography>
      </Box>
      <Box>
        <TextField
          variant="outlined"
          value={answer}
          onChange={handleChange}
          size='small'
          fullWidth />
      </Box>
    </>
  );
};

export default TypeAnswerQuestion;