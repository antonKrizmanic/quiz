'use client';

import { Suspense } from 'react';

import CategoryView from '@/views/CategoryView/CategoryView';
import LoadingContainer from '@/components/LoadingContainer/LoadingContainer';


function CategoryPage() {
    return (
        <Suspense fallback={<LoadingContainer isLoading={true}/>}>
            <CategoryView />
        </Suspense>
    );
}

export default CategoryPage;