import { Suspense } from 'react';
import LoadingContainer from '@/components/LoadingContainer/LoadingContainer';
import CategoryView from '@/views/CategoryView/CategoryView';

async function CategoryPage({ params }) {
    const { theme } = await params;

    return (
        <Suspense fallback={<LoadingContainer isLoading={true} />}>
            <CategoryView theme={theme} />
        </Suspense>
    );
}

export default CategoryPage;
