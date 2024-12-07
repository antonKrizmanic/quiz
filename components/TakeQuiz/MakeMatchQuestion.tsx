import React, { useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import QuestionHeader from '../reusable/QuestionHeader';

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
  questionType: number;
  parentId: number | null;
  children: Question[] | null;
  answers: Answer[];
}

interface MakeMatchQuestionProps {
  question: Question;
  questionIndex: number;
  questionCount: number;
  onAnswer: (questionId: number, answer: QuizTakeAnswerDto[]) => void;
  initialAnswer?: QuizTakeAnswerDto[];
}

function MakeMatchQuestion({ question, questionIndex, questionCount, onAnswer, initialAnswer }:MakeMatchQuestionProps) {
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
        const answer: QuizTakeAnswerDto = {
            questionId: childId,
            answerId: parseInt(answerId),
            parentId: question.id,
            text: ''
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
            <QuestionHeader questionIndex={questionIndex} questionCount={questionCount} questionText={question.text} helperText="(Spoji odgovarajuće pojmove)" />                        
            {question.children?.map((child) => (
                <>
                    <InputLabel key={`${child.id}-label`}>
                        {child.text}
                    </InputLabel>
                    <FormControl fullWidth sx={{ marginBottom: 3 }}>
                        <Select
                            key={`${child.id}-select`}
                            id="demo-simple-select"
                            value={selectedAnswers.find((a) => a.questionId === child.id)?.answerId || ''}
                            displayEmpty
                            onChange={(e) => handleSelectChange(child.id, e.target.value.toString())}
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
}

export default MakeMatchQuestion;