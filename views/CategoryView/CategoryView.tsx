'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { QuizCategory } from '@/component-models/types';
import { getQuizCategoriesWithQuestions } from '@/repositories/QuizCategoryRepository';

interface CategoryViewProps {
    theme: number;
}

export default function CategoryView({ theme }: CategoryViewProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<QuizCategory[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getQuizCategoriesWithQuestions(1, theme);
            setCategories(data);
            setLoading(false);
        };

        fetchCategories();
    }, [theme]);

    const handleCategorySelection = (category: string) => {
        router.push(`/init-quiz?theme=${theme}&category=${category}`);
    };

    const handleBack = () => {
        router.back();
    };

    if (loading) {

        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <Loader2 className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-spin" />
                    </div>
                    <p className="text-lg text-muted-foreground">Učitavanje kategorija...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 mb-12">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                    <BookOpen className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                    Odaberite kategoriju kviza
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Izaberite područje koje želite testirati
                </p>
            </div>

            {/* Categories */}
            <div className="space-y-4">
                {categories.length === 0 ? (
                    <Card className="p-8 text-center">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                <BookOpen className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-lg">Nije dohvaćena ni jedna kategorija</p>
                        </div>
                    </Card>
                ) : (
                    categories.map((category) => (
                        <Card
                            key={category.id}
                            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary-300 bg-card cursor-pointer"
                            onClick={() => handleCategorySelection(category.id.toString())}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
                                            <BookOpen className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Kliknite za pokretanje kviza
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Back Button */}
            <div className="pt-4">
                <Button
                    onClick={handleBack}
                    variant="outline"
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-600 border-2 border-slate-200 dark:border-slate-600 hover:border-primary-300 dark:hover:border-primary-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                    <div className="flex items-center justify-center space-x-3">
                        <div className="relative">
                            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300 group-hover:-translate-x-1" />
                            <div className="absolute inset-0 bg-primary-100 dark:bg-primary-900 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300">
                            Natrag na odabir teme
                        </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Button>
            </div>
        </div>
    );
}