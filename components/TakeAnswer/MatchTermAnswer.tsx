'use client';

import React, { useEffect, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { Answer, Question, QuizTakeQuestion } from '@/component-models/types';

import { get } from '../../services/HttpService';
import { Box, Grid, Typography } from '@mui/material';

interface MatchTermAnswerProps {
    questionId: number;
    quizTakeChildren: QuizTakeQuestion[];
}

function MatchTermAnswer({ questionId, quizTakeChildren }: MatchTermAnswerProps) {
    const [questionAnswerDictionary, setQuestionAnswerDictionary] = useState<Map<Question, Answer>>(new Map());
    const [answers, setAnswers] = useState<Answer[]>([]);

    useEffect(() => {
        const fetchQuestionAnswers = async () => {
            try {
                // eslint-disable-next-line max-len
                const childQuestionsResponse = await get(`Quizzes/PublicQuestion/getList/1?parentId=${questionId}&ActiveStatusId=0&QuizCategoryId=0&QuizId=0&QuizTheme=None&QuestionType=None&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=True&PerPage=10`);
                const childQuestions = childQuestionsResponse.data.list;

                const questionAnswerDict = new Map<Question, Answer>();
                const allAnswers: Answer[] = [];

                for (const childQuestion of childQuestions) {
                    // eslint-disable-next-line max-len
                    const answersResponse = await get(`Quizzes/PublicAnswer/GetList?questionId=${childQuestion.id}&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=False&PerPage=10`);
                    const answersData = answersResponse.data.list;
                    if (!questionAnswerDict.has(childQuestion)) {
                        questionAnswerDict.set(childQuestion, answersData[0]);
                    }
                    allAnswers.push(...answersData);
                }

                setQuestionAnswerDictionary(questionAnswerDict);
                setAnswers(allAnswers);
            } catch (error) {
                console.error('Error fetching question answers:', error);
            }
        };

        fetchQuestionAnswers();
    }, [questionId]);

    return (
        <>
            {Array.from(questionAnswerDictionary.entries()).map(([question, correctAnswer]: [Question, Answer], index) => {
                const questionTake = quizTakeChildren.find(x => x.questionId === question.id);
                const answer = questionTake?.answers[0];
    
                return (
                    <Box key={index} sx={{ pb: 4 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <Typography variant="body1">{question.text}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                {answer ? (
                                    answer.isCorrect ? (
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                Točan odgovor!
                                            </Typography>
                                            <Typography variant="body1">
                                                {correctAnswer.text} &nbsp;
                                                <CheckCircleIcon color="success" />
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <>
                                            {answers.find(x => x.id === answer.id)?.text ? (
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                        Tvoj odgovor:
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {answers.find(x => x.id === answer.id)?.text}&nbsp;
                                                        <CancelIcon color="error" />
                                                    </Typography>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                        Točan odgovor:
                                                    </Typography>
                                                    <Typography variant="body1">{correctAnswer.text}</Typography>
                                                </Box>
                                            ) : (
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                        Nisi odgovorio!
                                                    </Typography>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                        Točan odgovor:
                                                    </Typography>
                                                    <Typography variant="body1">{correctAnswer.text}</Typography>
                                                </Box>
                                            )}
                                        </>
                                    )
                                ) : (
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                            Nisi odgovorio!
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                            Točan odgovor:
                                        </Typography>
                                        <Typography variant="body1">{correctAnswer.text}</Typography>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                );
            })}
        </>
    );
}

export default MatchTermAnswer;