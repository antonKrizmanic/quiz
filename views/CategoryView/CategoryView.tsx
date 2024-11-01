'use client';
import { useRouter } from 'next/navigation';

import { Button, Stack, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface Category {
  Id: number;
  Name: string;
  IsActiveDescription: string;
  QuizTheme: number;
  Description: string | null;
}

interface CategoryViewProps {
    categories: Category[];
    theme: number;
}

export default function CategoryView({categories, theme}: CategoryViewProps) {
    const router = useRouter();    
    console.log(categories);    

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
                        <Button onClick={() => handleCategorySelection(category.Id.toString())}
                            variant="outlined"
                            key={category.Id}>
                            {category.Name}
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