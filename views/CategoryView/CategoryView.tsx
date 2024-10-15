import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Stack, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import LoadingContainer from '@/components/LoadingContainer/LoadingContainer';

import { get } from '../../services/HttpService';


interface Category {
  id: number;
  name: string;
  isActiveDescription: string;
  quizTheme: number;
  description: string | null;
}

export default function CategoryView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const theme = searchParams.get('theme');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // eslint-disable-next-line max-len
                const response = await get(`Quizzes/PublicQuizCategory/GetAllWithAnyQuestion/1/${theme}`);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        if (theme) {
            fetchCategories();
        }
    }, [theme]);

    const handleCategorySelection = (category: string) => {
        router.push(`/init-quiz?theme=${theme}&category=${category}`);
    };

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return <LoadingContainer isLoading={true}/>;
    }

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