'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { post } from '../../services/HttpService';
import BigRedButton from '@/components/Buttons/BigRedButton';
import BigGrayButton from '@/components/Buttons/BigGrayButton';

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

    return (
        <>

            {quizId ? (
                <div className="w-full max-w-screen-md mx-auto px-6">
                    <div className="flex justify-center p-4 px-3">                    
                        <div className="w-full">
                        <h2 className="text-2xl text-center mb-4">Malo o pravilima</h2>
                            <div className="bg-white shadow-md rounded-lg px-3 py-2 mb-4">
                                <div className="pb-3 text-sm">
                                    <div className="flex justify-start text-gray-700 rounded-md px-2 py-2 my-2">
                                        <span className="bg-red-400 h-2 w-2 m-2 rounded-full"></span>
                                        <div className="flex-grow font-medium px-2">Nema vremenskog ograničenja</div>
                                    </div>
                                    <div className="flex justify-start text-gray-700 rounded-md px-2 py-2 my-2">
                                        <span className="bg-red-400 h-2 w-2 m-2 rounded-full"></span>
                                        <div className="flex-grow font-medium px-2">Moraš odgovoriti na sva pitanja</div>
                                    </div>
                                    <div className="flex justify-start text-gray-700 rounded-md px-2 py-2 my-2">
                                        <span className="bg-red-400 h-2 w-2 m-2 rounded-full"></span>
                                        <div className="flex-grow font-medium px-2">Ako napustiš ovu stranicu za vrijeme rješavanja kviza, morat ćeš početi ispočetka</div>
                                    </div>
                                    <div className="flex justify-start text-gray-700 rounded-md px-2 py-2 my-2">
                                        <span className="bg-red-400 h-2 w-2 m-2 rounded-full"></span>
                                        <div className="flex-grow font-medium px-2">Na kraju ćeš moći pregledati svoj rezultat</div>
                                    </div>
                                </div>
                                <div className="block bg-white text-center mb-2 rounded-b-lg">
                                    <BigGrayButton
                                    cssClasses="m-2"
                                        onClick={handleBack}
                                    >
                                        Natrag
                                    </BigGrayButton>
                                    <BigRedButton
                                        onClick={handleStartQuiz}
                                    >
                                        Start
                                    </BigRedButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Error initializing quiz. Please try again.</p>
            )}
        </>
    );
};

export default InitQuizPage;