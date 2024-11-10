'use client';
import { useRouter } from 'next/navigation';
import { Button, Stack, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { QuizCategory } from '@/component-models/types';

interface CategoryViewProps {
    categories: QuizCategory[];
    theme: number;
}

export default function CategoryView({categories, theme}: CategoryViewProps) {
    const router = useRouter();

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