'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { red } from '@mui/material/colors';
import { Button, Card, CardActions, CardContent, List, ListItem, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { post } from '../../services/HttpService';



function InitQuizPage() {
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
                    CityAssociationId: 1
                };

                const response = await post('quizzes/PublicQuiz', data);
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
        'Nema vremenskog ograničenja',
        'Moraš odgovoriti na sva pitanja',
        'Ako napustiš ovu stranicu za vrijeme rješavanja kviza, morat ćeš početi ispočetka',
        'Na kraju ćeš moći pregledati svoj rezultat'
    ];

    return (
        <>
            {quizId ? (
                <>
                    <Typography variant="h1" gutterBottom>Malo o pravilima</Typography>
                    <Card sx={{width:'100%'}}>
                        <CardContent>
                            <List>
                                {infoItems.map((item, index) => (
                                    <ListItem key={index}>
                                        <CircleIcon sx={{ color: red[500], fontSize: 12 }} /> &nbsp;
                                        {item}
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                        <CardActions sx={{justifyContent: 'space-between'}}>
                            <Button onClick={handleBack} variant="outlined"><FontAwesomeIcon icon={faArrowLeft} /> &nbsp; Natrag</Button>
                            <Button onClick={handleStartQuiz}
                                variant="outlined"
                                sx={{marginLeft:'auto'}}>Start</Button>
                        </CardActions>
                    </Card>

                </>
            ) : (
                <p>Error initializing quiz. Please try again.</p>
            )}
        </>
    );
}

export default InitQuizPage;