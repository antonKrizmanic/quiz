'use client'

import React, { useEffect, useState } from 'react';
import { get } from '../../services/HttpService';
import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Answer } from '@/component-models/types';

interface MultiSelectAnswerProps {
    givenAnswers?: Answer[];
    questionId: number;
}

const MultiSelectAnswer: React.FC<MultiSelectAnswerProps> = ({ givenAnswers, questionId }) => {

    const [answers, setAnswers] = useState<Answer[]>([]);

    useEffect(() => {
        const fetchAnswers = async () => {
            const response = await get(`Quizzes/publicAnswer/GetList?QuestionId=${questionId}&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=True&PerPage=10`);
            setAnswers(response.data.list);
        };
        fetchAnswers();
    }, []);

    return (
        <>
            {!givenAnswers ? (
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Na ovo pitanje nije odgovoreno! <CancelIcon color='error'/>
                </Typography>
            ) : null}
            <Box>
                <FormGroup>
                    {answers.map((answer) => {
                        const isChecked = givenAnswers && givenAnswers.some(x => x.id === answer.id);
                            const icon = answer.isCorrect ? (
                                <CheckCircleIcon color='success' />
                            ) : (
                                givenAnswers && !answer.isCorrect && givenAnswers.some(x => x.id === answer.id) && (
                                    <CancelIcon color='error'/>
                                )
                            );
                            
                        return (
                            <FormControlLabel
                                key={answer.id}
                                control={<Checkbox checked={isChecked} />}
                                label={
                                    <Box display="flex" alignItems="center">
                                        <span>{answer.text} &nbsp;</span>
                                        {icon}
                                    </Box>
                                }
                                disabled
                            />
                        );
                    })}
                </FormGroup>
            </Box>            
        </>
    );
};

export default MultiSelectAnswer;