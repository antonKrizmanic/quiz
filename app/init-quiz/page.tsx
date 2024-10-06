'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { get, post } from '../../services/HttpService';
import BigRedButton from '@/components/Buttons/BigRedButton';
import BigGrayButton from '@/components/Buttons/BigGrayButton';

interface QuizInitData {
    quizId: number;
    // Add other relevant fields if needed
}

const InitQuizPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const theme = searchParams.get('theme');
    const category = searchParams.get('category');
    const [quizInitData, setQuizInitData] = useState<QuizInitData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initializeQuiz = async () => {
            try {
                const data = {
                    QuizCategoryId: category ? parseInt(category) : null,
                    QuizTheme: theme ? parseInt(theme) : null,
                    CityAssociationId: 1,
                  };
          
                  const response = await post('/quizzes/PublicQuiz', data);
                setQuizInitData(response.data);
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
        if (quizInitData) {
            router.push(`/quiz?quizId=${quizInitData.quizId}`);
        }
    };

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl mb-4">Malo o pravilima</h2>
            {quizInitData ? (
                <div className="w-full max-w-screen-md mx-auto px-6">
                    <div className="flex justify-center p-4 px-3">
                        <div className="w-full">
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
        </div>
    );
};

export default InitQuizPage;