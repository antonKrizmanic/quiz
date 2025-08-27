import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Brain, Trophy } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { QuizTakeDetailViewModel } from '@/component-models/types';
import MatchTermAnswer from '@/components/TakeAnswer/MatchTermAnswer';
import MultiSelectAnswer from '@/components/TakeAnswer/MultiSelectAnswer';
import SingleSelectAnswer from '@/components/TakeAnswer/SingleSelectAnswer';
import TextInputAnswer from '@/components/TakeAnswer/TextInputAnswer';

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { get } from '../../services/HttpService';

export default function ResultView() {
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
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        );
    }

    if (!results) {
        return (
            <div className="space-y-8">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                        <Brain className="h-8 w-8 text-destructive" />
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">Rezultat nije pronađen</h2>
                    <p className="text-muted-foreground">Nije pronađen rezultat za ovaj kviz.</p>
                </div>
                <Card className="w-full">
                    <CardFooter className="flex justify-center pt-6">
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            className="group relative overflow-hidden bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-600 border-2 border-slate-200 dark:border-slate-600 hover:border-primary-300 dark:hover:border-primary-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300 group-hover:-translate-x-1" />
                                    <div className="absolute inset-0 bg-primary-100 dark:bg-primary-900 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                                </div>
                                <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300">
                                    Natrag
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const scorePercentage = Math.round((results.score / results.questionNumber) * 100);
    const isExcellent = scorePercentage >= 90;
    const isGood = scorePercentage >= 70;
    const isPassing = scorePercentage >= 50;

    return (
        <div className="space-y-8 mb-12">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                    <Trophy className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                    Tvoj rezultat
                </h1>
                <div className="space-y-2">
                    <p className="text-2xl font-semibold text-foreground">
                        {results.score}/{results.questionNumber} ({scorePercentage}%)
                    </p>
                    <div className="w-full max-w-md mx-auto bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full transition-all duration-1000 ease-out ${isExcellent ? 'bg-green-500' :
                                isGood ? 'bg-blue-500' :
                                    isPassing ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                            style={{ width: `${scorePercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        {isExcellent ? 'Odlično! 🎉' :
                            isGood ? 'Dobro! 👍' :
                                isPassing ? 'Prošao si! ✅' : 'Može bolje! 💪'}
                    </p>
                </div>
            </div>

            {/* Results Card */}
            <Card className="w-full group hover:shadow-lg transition-all duration-300 border-2 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-400">
                <CardContent className="pt-8 pb-6">
                    <div className="space-y-6">
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
                                <div
                                    key={index}
                                    className={`w-full rounded-lg border-2 px-4 py-3 transition-all duration-300 ${question.isCorrect
                                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                                        : 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20'
                                        }`}
                                >
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${question.isCorrect
                                                ? 'bg-green-100 dark:bg-green-900'
                                                : 'bg-primary-100 dark:bg-primary-900'
                                                }`}>
                                                <span className={`text-xs font-bold ${question.isCorrect
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-primary-600 dark:text-primary-400'
                                                    }`}>
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-base text-foreground">
                                                {question.text}
                                            </h3>
                                        </div>
                                        <div>
                                            {questionContent}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center pt-6 border-t border-border">
                    <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        className="group relative overflow-hidden bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-600 border-2 border-slate-200 dark:border-slate-600 hover:border-primary-300 dark:hover:border-primary-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300 group-hover:-translate-x-1" />
                                <div className="absolute inset-0 bg-primary-100 dark:bg-primary-900 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                            </div>
                            <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300">
                                Natrag na početnu stranicu
                            </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}