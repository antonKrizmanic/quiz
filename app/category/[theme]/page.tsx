import { Suspense } from 'react';

import CategoryView from '@/views/CategoryView/CategoryView';
import LoadingContainer from '@/components/LoadingContainer/LoadingContainer';
import { getQuizCategoriesWithQuestions } from '@/repositories/QuizCategoryRepository';


async function CategoryPage({ params }) {
    const { theme } = await params;
    let categories = await getQuizCategoriesWithQuestions(1, parseInt(theme));
    
    return (
        <Suspense fallback={<LoadingContainer isLoading={true}/>}>
            <CategoryView categories={categories} theme={theme}/>
        </Suspense>
    );
}

export default CategoryPage;