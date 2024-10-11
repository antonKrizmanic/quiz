'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { post } from '../../services/HttpService';
import { Card, Typography, List, ListItem, Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';



const InitQuizPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const theme = searchParams.get('theme');
    const category = searchParams.get('category');
    const [quizId, setQuizId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initializeQuiz = async () => {
            try {
                const data = {
                    QuizCategoryId: category ? parseInt(category) : null,
                    QuizTheme: theme ? parseInt(theme) : null,
                    CityAssociationId: 1,
                };

                const response = await post('quizzes/PublicQuiz', data);
                console.log(response.data);
                setQuizId(response.data);
            } catch (error) {
                console.error('Error initializing quiz:', error);
            } finally {
                setLoading(false);
            }
        };

        if (theme && category) {
            initializeQuiz();
        }
    }, [theme, category]);

    const handleStartQuiz = () => {
        if (quizId) {
            router.push(`/quiz?quizId=${quizId}`);
        }
    };

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const infoItems = [
        "Nema vremenskog ograničenja",
        "Moraš odgovoriti na sva pitanja",
        "Ako napustiš ovu stranicu za vrijeme rješavanja kviza, morat ćeš početi ispočetka",
        "Na kraju ćeš moći pregledati svoj rezultat"
    ];

    return (
        <>

            {quizId ? (
                <>
                    <Typography type="h2">Malo o pravilima</Typography>
                    <Card>
                        <Card.Body>
                            <List className="pb-3 text-sm">
                                {infoItems.map((item, index) => (
                                    <ListItem key={index}>
                                        <FontAwesomeIcon icon={faCircle} className="text-red-400 h-2 w-2 m-2 rounded-full" />
                                        {item}
                                    </ListItem>
                                ))}
                            </List>
                        </Card.Body>
                        <Card.Footer>
                            <div className="flex justify-between">
                                <Button onClick={handleBack} variant="outline" size={'lg'}><FontAwesomeIcon icon={faArrowLeft} /> &nbsp; Natrag</Button>
                                <Button onClick={handleStartQuiz} variant="outline" size={'lg'}>Start</Button>
                            </div>
                        </Card.Footer>
                    </Card>

                </>
            ) : (
                <p>Error initializing quiz. Please try again.</p>
            )}
        </>
    );
};

export default InitQuizPage;