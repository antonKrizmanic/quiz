'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import TextInputAnswer from '@/components/TakeAnswer/TextInputAnswer';
import SingleSelectAnswer from '@/components/TakeAnswer/SingleSelectAnswer';
import MultiSelectAnswer from '@/components/TakeAnswer/MultiSelectAnswer';
import MatchTermAnswer from '@/components/TakeAnswer/MatchTermAnswer';
import { QuizTakeDetailViewModel } from '@/component-models/types';

import { get } from '../../services/HttpService';


function TakeResultPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const takeId = searchParams.get('take-id');
    const [loading, setLoading] = useState<boolean>(true);
    const [results, setResults] = useState<QuizTakeDetailViewModel>();

    useEffect(() => {
        const fetchResults = async () => {
            if (!takeId) return;

            try {
                const response = await get(`quizzes/PublicQuizTake/Get/${takeId}`);
                const resultData = response.data;
                setResults(resultData);
            } catch (error) {
                console.error('Error fetching quiz results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [takeId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!results) {
        return (
            <div className="lg:max-w-screen-md w-screen mx-auto md:px-6">
                <div className="flex justify-center px-3">
                    <div className="w-full">
                        <div className="bg-white shadow-md rounded-lg px-3">
                            <p className="mb-3 text-center">Nije pronađen rezultat za ovaj kviz.</p>
                            <Button onClick={() => router.back()}>
                                <FontAwesomeIcon icon={faArrowLeft} /> Natrag
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Typography variant="h1" gutterBottom>Tvoj rezultat je {results.score}/{results.questionNumber}</Typography>
            <Card sx={{width:'100%', marginBottom: 3}}>
                <CardContent>
                    {results.quizTakeQuestions.map((question, index) => {
                        let questionContent;
                        switch (question.questionType) {
                        case 1:
                            questionContent = <SingleSelectAnswer givenAnswer={question.answers[0]} questionId={question.questionId} />;
                            break;
                        case 2:
                            questionContent = <MultiSelectAnswer givenAnswers={question.answers} questionId={question.questionId} />;
                            break;
                        case 3:
                            questionContent = <TextInputAnswer givenAnswer={question.answers[0]} questionId={question.questionId} />;
                            break;
                        case 4:
                            questionContent = <MatchTermAnswer quizTakeChildren={question.children} questionId={question.questionId} />;
                            break;
                        default:
                            questionContent = <p>Nepoznata vrsta pitanja</p>;
                        }

                        return (
                            <Alert key={index}
                                severity={question.isCorrect ? 'success' : 'error'}
                                sx={{marginBottom: 3}}>
                                <div>
                                    <Typography variant="subtitle1" sx={{fontWeight:500}}>{question.index+1}. {question.text}</Typography>
                                    {questionContent}
                                </div>
                            </Alert>
                        );
                    })}
                </CardContent>
                <CardActions sx={{justifyContent: 'center'}}>
                    <Button onClick={() => router.push('/')} variant="outlined">
                        <FontAwesomeIcon icon={faArrowLeft} />
                        &nbsp;Natrag na početnu stranicu
                    </Button>
                </CardActions>
            </Card>
        </>
    );
}

export default TakeResultPage;