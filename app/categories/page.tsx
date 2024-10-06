'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {get} from '../../services/HttpService';
import BigRedButton from '@/components/Buttons/BigRedButton';

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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl mb-4">Odaberite kategoriju kviza</h2>
      <div className="flex flex-col space-y-4">
        {categories.length === 0 ? (
          <p>Nije dohvaćena ni jedna kategorija</p>
        ) : (
          categories.map((category) => (
            <BigRedButton
              key={category.id}              
              onClick={() => handleCategorySelection(category.name)}
            >
              {category.name}
            </BigRedButton>
          ))
        )}
        <BigRedButton          
          onClick={handleBack}
        >
          Natrag
        </BigRedButton>
      </div>
    </div>
  );
};

export default CategoriesPage;