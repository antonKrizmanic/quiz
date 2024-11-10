'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Stack, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { getQuizCategoriesWithQuestions } from '@/repositories/QuizCategoryRepository';
import { QuizCategory } from '@/component-models/types';

interface CategoryViewProps {
    theme: number;
}

export default function CategoryView({theme}: CategoryViewProps) {
    const router = useRouter();
    const [categories, setCategories] = useState<QuizCategory[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getQuizCategoriesWithQuestions(1, theme);
            setCategories(data);
        };

        fetchCategories();
    }, [theme]);

    const handleCategorySelection = (category: string) => {
        router.push(`/init-quiz?theme=${theme}&category=${category}`);
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <>
            <Typography variant="h1" gutterBottom>Odaberite kategoriju kviza</Typography>
            <Stack spacing={1} sx={{marginBottom:3}}>
                {categories.length === 0 ? (
                    <Typography>Nije dohvaćena ni jedna kategorija</Typography>
                ) : (
                    categories.map((category) => (
                        <Button onClick={() => handleCategorySelection(category.id.toString())}
                            variant="outlined"
                            key={category.id}>
                            {category.name}
                        </Button>
                    ))
                )}
                <Button onClick={handleBack} variant="outlined">
                    <FontAwesomeIcon icon={faArrowLeft} /> &nbsp;
                    Natrag
                </Button>
            </Stack>
        </>
    );
}