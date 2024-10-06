'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {get} from '../../services/HttpService';

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
            <button
              key={category.id}
              className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition-colors duration-300"
              onClick={() => handleCategorySelection(category.name)}
            >
              {category.name}
            </button>
          ))
        )}
        <button
          className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition-colors duration-300"
          onClick={handleBack}
        >
          Natrag
        </button>
      </div>
    </div>
  );
};

export default CategoriesPage;