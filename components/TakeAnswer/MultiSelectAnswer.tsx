'use client';

import React, { useEffect, useState } from 'react';
import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { Answer } from '@/component-models/types';

import { get } from '../../services/HttpService';

interface MultiSelectAnswerProps {
    givenAnswers?: Answer[];
    questionId: number;
}

function MultiSelectAnswer({ givenAnswers, questionId }:MultiSelectAnswerProps) {

    const [answers, setAnswers] = useState<Answer[]>([]);

    useEffect(() => {
        const fetchAnswers = async () => {
            // eslint-disable-next-line max-len
            const response = await get(`Quizzes/publicAnswer/GetList?QuestionId=${questionId}&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=True&PerPage=10`);
            setAnswers(response.data.list);
        };
        fetchAnswers();
    }, [questionId]);

    return (
        <>
            {!givenAnswers ? (
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Na ovo pitanje nije odgovoreno! <CancelIcon color="error"/>
                </Typography>
            ) : null}
            <Box>
                <FormGroup>
                    {answers.map((answer) => {
                        const isChecked = givenAnswers && givenAnswers.some(x => x.id === answer.id);
                        const icon = answer.isCorrect ? (
                            <CheckCircleIcon color="success" />
                        ) : (
                            givenAnswers && !answer.isCorrect && givenAnswers.some(x => x.id === answer.id) && (
                                <CancelIcon color="error"/>
                            )
                        );

                        return (
                            <div key={answer.id}>
                                <FormControlLabel
                                    control={<Checkbox checked={isChecked} />}
                                    label={
                                        <Box display="flex" alignItems="center">
                                            <span>{answer.text} &nbsp;</span>
                                            {icon}
                                        </Box>
                                    }
                                    disabled
                                />
                            </div>
                        );
                    })}
                </FormGroup>
            </Box>
        </>
    );
}

export default MultiSelectAnswer;