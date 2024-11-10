import { Suspense } from 'react';
import CategoryView from '@/views/CategoryView/CategoryView';
import LoadingContainer from '@/components/LoadingContainer/LoadingContainer';

async function CategoryPage({ params }) {
    const { theme } = await params;    

    return (
        <Suspense fallback={<LoadingContainer isLoading={true}/>}>
            <CategoryView theme={theme}/>
        </Suspense>
    );
}

export default CategoryPage;