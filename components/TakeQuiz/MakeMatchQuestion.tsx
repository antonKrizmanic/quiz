import { Box, FormControl, InputLabel, MenuItem, NativeSelect, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface QuizTakeAnswerDto {
  questionId: number;
  answerId: number;
  parentId?: number;
  text: string;
}

interface Answer {
  id: number;
  text: string;
  questionId: number;
}

interface Question {
  id: number;
  text: string;
  questionType: string;
  options: string[];
  parentId: number | null;
  children: Question[] | null;
  answers: Answer[];
}

interface MakeMatchQuestionProps {
  question: Question;
  questionIndex: number;
  onAnswer: (questionId: number, answer: QuizTakeAnswerDto[]) => void;
  initialAnswer?: QuizTakeAnswerDto[];
}

const MakeMatchQuestion: React.FC<MakeMatchQuestionProps> = ({ question, questionIndex, onAnswer, initialAnswer }) => {
  const [possibleAnswers, setPossibleAnswers] = useState<Answer[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<QuizTakeAnswerDto[]>([]);

  useEffect(() => {
    const answers = question.children?.map((child) => child.answers).flat() || [];
    setPossibleAnswers(answers);

    if (initialAnswer) {
      setSelectedAnswers(initialAnswer);
    }
  }, [question, initialAnswer]);

  const handleSelectChange = (childId: number, answerId: string) => {
    console.log('something')
    const answer: QuizTakeAnswerDto = {
      questionId: childId,
      answerId: parseInt(answerId),
      parentId: question.id,
      text: '',
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
    <>
      <Box sx={{ marginBottom: '16px' }}>
        <Typography
          variant='subtitle1'
          sx={{ lineHeight: 1, fontWeight: 600 }}>
          {questionIndex + 1}. {question.text}</Typography>
        <Typography
          variant='caption'>
          (Spoji odgovarajuće pojmove)
        </Typography>
      </Box>
      {question.children?.map((child) => (
        <>
          <InputLabel>
            {child.text}
          </InputLabel>
          <FormControl fullWidth sx={{ marginBottom: 3 }}>
            <Select
              id="demo-simple-select"
              value={selectedAnswers.find((a) => a.questionId === child.id)?.answerId || ''}
              displayEmpty
              onChange={(e) => handleSelectChange(child.id, e.target.value)}
            >
              {possibleAnswers.map((answer) => (
                <MenuItem key={answer.id} value={answer.id}>
                  {answer.text}
                </MenuItem>
              ))}
            </Select>            
          </FormControl>
        </>
      ))}
    </>
  );
};

export default MakeMatchQuestion;