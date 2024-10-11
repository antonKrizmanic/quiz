'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { get } from '../../services/HttpService';
import BigRedButton from '@/components/Buttons/BigRedButton';
import { Button, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface Category {
  id: number;
  name: string;
  isActiveDescription: string;
  quizTheme: number;
  description: string | null;
}

const CategoriesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = searchParams.get('theme');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await get(`Quizzes/PublicQuizCategory/GetList/1?QuizTheme=${theme}&ActiveStatusId=1&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=True&PerPage=10`);
        setCategories(response.data.list);
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
    return <div>Loading...</div>;
  }

  return (
    <>
      <Typography type="h2" className="mt-3">Odaberite kategoriju kviza</Typography>      
      <div className="px-6 my-3">
        <div className="flex flex-col">
          {categories.length === 0 ? (
            <Typography>Nije dohvaćena ni jedna kategorija</Typography>
          ) : (
            categories.map((category) => (
              <Button isFullWidth className="mt-3" onClick={() => handleCategorySelection(category.id.toString())} variant="outline" size={'lg'} key={category.id}>
                {category.name}
              </Button>              
            ))
          )}
          <Button isFullWidth className="mt-3" onClick={handleBack} variant="outline" size={'lg'}>
            <FontAwesomeIcon icon={faArrowLeft} /> &nbsp;
            Natrag
          </Button>          
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;