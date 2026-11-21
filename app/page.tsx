import { Suspense } from 'react';
import { CategoryBrowser } from '@/components/quiz/category-browser';

export default function HomePage() {
    return (
        <Suspense>
            <CategoryBrowser />
        </Suspense>
    );
}
