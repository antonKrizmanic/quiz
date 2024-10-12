'use client'

import React, { useState, useEffect } from 'react';
import { get } from '../../services/HttpService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Answer } from '@/component-models/types';


interface SingleSelectAnswerProps {
    givenAnswer?: Answer;
    questionId: number;
}

const SingleSelectAnswer: React.FC<SingleSelectAnswerProps> = ({ givenAnswer, questionId }) => {
    const [answers, setAnswers] = useState<Answer[]>([]);

    useEffect(() => {
        const fetchAnswers = async () => {
            const response = await get(`Quizzes/publicAnswer/GetList?QuestionId=${questionId}&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=True&PerPage=10`);
            setAnswers(response.data.list);
        };
        fetchAnswers();
        console.log(givenAnswer, questionId);
    }, []);

    return (
        <>
            {!givenAnswer ? (
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Na ovo pitanje nije odgovoreno! <FontAwesomeIcon icon={faTimesCircle} className="text-red-600" />
                </Typography>
            ) : null}
            <Box>                
                <FormControl>                    
                <RadioGroup
                        aria-labelledby="radio-buttons-group-label"
                        name="radio-buttons-group"
                    >
                        {answers.map((answer) => {
                            const icon = answer.isCorrect ? (
                                <CheckCircleIcon color='success' />
                            ) : (
                                givenAnswer && !answer.isCorrect && answer.id === givenAnswer.id && (
                                    <CancelIcon color='error'/>
                                )
                            );
                            return(
                                
                            <FormControlLabel
                                key={answer.id}
                                value={answer.id}
                                control={<Radio checked={givenAnswer && answer.id === givenAnswer.id} />}
                                disabled
                                label={
                                    <Box display="flex" alignItems="center">
                                        <span>{answer.text} &nbsp;</span>
                                        {icon}
                                    </Box>
                                }
                            />
                            );
                        })}
                    </RadioGroup>
                </FormControl>
            </Box>            
        </>
    );
};

export default SingleSelectAnswer;