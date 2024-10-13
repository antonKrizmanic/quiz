'use client';

import React, { useEffect, useState } from 'react';
import { List, ListItem, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { Answer } from '@/component-models/types';

import { get } from '../../services/HttpService';

interface TextInputAnswerProps {
    givenAnswer?: Answer;
    questionId: number;
}

function TextInputAnswer({ givenAnswer, questionId }:TextInputAnswerProps) {

    const [answers, setAnswers] = useState<Answer[]>([]);

    useEffect(() => {
        const fetchAnswers = async () => {
            // eslint-disable-next-line max-len
            const response = await get(`Quizzes/publicAnswer/GetList?QuestionId=${questionId}&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=True&PerPage=10`);
            setAnswers(response.data.list);
        };

        fetchAnswers();
    },[questionId]);

    return (
        <>
            {(!givenAnswer || !givenAnswer.text) ? (
                <Typography sx={{fontWeight: 500}}>Nisi odgovorio!</Typography>
            ) : (
                <>
                    <Typography sx={{fontWeight:500}}>Tvoj odgovor:</Typography>
                    <Typography>
                        {givenAnswer.text}  &nbsp;
                        {givenAnswer.isCorrect ? (
                            <CheckCircleIcon color="success" />
                        ) : (
                            <CancelIcon color="error"/>
                        )}
                    </Typography>
                </>
            )}

            <Typography>Odgovori koji se priznaju:</Typography>
            <List>
                {answers.map((correctAnswer, index) => (
                    <ListItem key={index}>{index + 1}. {correctAnswer.text}</ListItem>
                ))}
            </List>
        </>
    );
}

export default TextInputAnswer;