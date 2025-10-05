import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, CheckCircle, Clock, Info, Play, Trophy } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useConfig } from '@/components/providers/ConfigProvider';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { initializeQuiz } from '@/repositories/QuizRepository';

export default function InitQuizView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const config = useConfig();
    const theme = searchParams.get('theme');
    const category = searchParams.get('category');
    const [quizId, setQuizId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initializeQuiz = async () => {
            try {
                const quizCategoryId = category ? parseInt(category) : null;
                const quizTheme = theme ? parseInt(theme) : null;

                const quizIdentifier = await initializeQuiz({
                    quizCategoryId,
                    quizTheme,
                    cityAssociationId: config.cityAssociationId
                });
                setQuizId(quizIdentifier);
            } catch (error) {
                console.error('Error initializing quiz:', error);
            } finally {
                setLoading(false);
            }
        };

        if (theme && category) {
            initializeQuiz();
        }
    }, [theme, category, config.cityAssociationId]);

    const handleStartQuiz = () => {
        if (quizId) {
            router.push(`/quiz?quizId=${quizId}`);
        }
    };

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        );
    }

    const infoItems = [
        { text: 'Nema vremenskog ograničenja', icon: Clock },
        { text: 'Moraš odgovoriti na sva pitanja', icon: CheckCircle },
        { text: 'Ako napustiš ovu stranicu za vrijeme rješavanja kviza, morat ćeš početi ispočetka', icon: AlertTriangle },
        { text: 'Na kraju ćeš moći pregledati svoj rezultat', icon: Trophy }
    ];

    return (
        <div className="space-y-8 mb-12">
            {quizId ? (
                <>
                    {/* Header Section */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                            <Info className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                            Malo o pravilima
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-md mx-auto">
                            Pročitajte pravila prije početka kviza
                        </p>
                    </div>

                    {/* Rules Card */}
                    <Card className="w-full group hover:shadow-lg transition-all duration-300 border-2 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-400">
                        <CardContent className="pt-8 pb-6">
                            <div className="space-y-6">
                                {infoItems.map((item, index) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <div key={index} className="flex items-start gap-4 group/item">
                                            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center group-hover/item:bg-primary-200 dark:group-hover/item:bg-primary-800 transition-colors">
                                                <IconComponent className="h-5 w-5 text-red-600 dark:text-red-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-foreground text-lg leading-relaxed group-hover/item:text-primary-700 dark:group-hover/item:text-primary-300 transition-colors">
                                                    {item.text}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-6 border-t border-border">
                            <Button
                                onClick={handleBack}
                                variant="outline"
                                className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-colors"
                            >
                                <div className="flex items-center space-x-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    <span>Natrag</span>
                                </div>
                            </Button>
                            <Button
                                onClick={handleStartQuiz}
                                size="lg"
                                className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-bold text-xl px-12 py-6 transition-colors"
                            >
                                <Play className="h-6 w-6 mr-3" />
                                Započni kviz
                            </Button>
                        </CardFooter>
                    </Card>
                </>
            ) : (
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                        <Info className="h-8 w-8 text-destructive" />
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">Greška pri pokretanju kviza</h2>
                    <p className="text-muted-foreground">Molimo pokušajte ponovno.</p>
                    <Button onClick={handleBack} variant="outline" className="mt-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Natrag
                    </Button>
                </div>
            )}
        </div>
    );
}