import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

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
  onAnswer: (questionId: number, answers: Answer[]) => void;
  initialAnswers?: Answer[];
}

const ChooseManyQuestion: React.FC<ChooseManyQuestionProps> = ({ question, questionIndex, onAnswer, initialAnswers }) => {
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
      <Box sx={{ marginBottom: '16px' }}>
        <Typography
          variant='subtitle1'
          sx={{ lineHeight: 1, fontWeight: 600 }}>
          {questionIndex + 1}. {question.text}</Typography>
        <Typography
          variant='caption'>
          (Odaberi više odgovora)
        </Typography>
      </Box>
      <Box>
        <FormGroup>
          {question.answers.map((option) => (
            <FormControlLabel
              key={option.id}
              control={<Checkbox checked={selectedAnswers.some((answer) => answer.id === option.id)}/>}
              label={option.text}
              onChange={() => handleChange(option.id)}
            />
          ))}          
        </FormGroup>
      </Box>      
    </>
  );
};

export default ChooseManyQuestion;