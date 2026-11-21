'use client';

import { FolderSearch, Layers3, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useConfig, useQuizApi } from '@/components/quiz/config-provider';
import { Button, PendingIcon } from '@/components/ui/button';
import { Notice } from '@/components/ui/notice';
import { Skeleton } from '@/components/ui/skeleton';
import {
    CATEGORY_PARAM,
    errorMessage,
    indexCategories,
    parseCategoryId,
} from '@/lib/categories';
import { cx } from '@/lib/cx';
import type { PublicQuestionCategory } from '@/types/quiz-public';
import { CategoryDetail } from './category-detail';
import { CategoryTree } from './category-tree';

export function CategoryBrowser() {
    const city = useConfig();
    const quizApi = useQuizApi();
    const selectedId = parseCategoryId(useSearchParams().get(CATEGORY_PARAM));
    const [categories, setCategories] = useState<
        PublicQuestionCategory[] | null
    >(null);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setError(null);
        try {
            setCategories(await quizApi.getCategories(city.cityAssociationId));
        } catch (cause) {
            setError(errorMessage(cause, 'Kategorije nisu dostupne.'));
        }
    }, [quizApi, city.cityAssociationId]);

    useEffect(() => {
        void load();
    }, [load]);

    const index = useMemo(
        () => (categories ? indexCategories(categories) : null),
        [categories],
    );
    const selected =
        selectedId === null ? null : (index?.byId.get(selectedId) ?? null);
    const detailView = selectedId !== null;

    function selectCategory(id: number | null) {
        const url = new URL(window.location.href);
        if (id === null) url.searchParams.delete(CATEGORY_PARAM);
        else url.searchParams.set(CATEGORY_PARAM, String(id));
        window.history.pushState(null, '', `${url.pathname}${url.search}`);
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    const retry = (
        <Button variant="secondary" block onClick={load}>
            <PendingIcon icon={RefreshCw} />
            Pokušaj ponovno
        </Button>
    );

    return (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-start lg:gap-8">
            <section
                className={cx(
                    'relative isolate overflow-hidden pt-4 pb-3 sm:pt-8 sm:pb-6 lg:col-span-2',
                    detailView && 'max-lg:sr-only',
                )}
            >
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-8 right-0 -z-10 text-[15rem] leading-none font-extrabold text-white/8 select-none sm:-top-16 sm:text-[22rem]"
                >
                    ?
                </span>
                <p className="inline-flex rounded-full bg-white/16 px-3 py-1.5 text-[0.8125rem] font-bold tracking-wide">
                    {city.title}
                </p>
                <h1 className="mt-4 max-w-3xl text-[2.5rem]/[1.04] font-extrabold tracking-tight text-balance sm:text-6xl/[1.02]">
                    {city.heroSection.title}
                </h1>
                <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-white/90 sm:text-xl/relaxed">
                    {city.heroSection.description} Odaberite kategoriju i kviz
                    koji želite riješiti.
                </p>
            </section>

            <aside
                className={cx(
                    'lg:sticky lg:top-6',
                    detailView && 'max-lg:hidden',
                )}
            >
                <section
                    aria-labelledby="categories-heading"
                    className="card p-2"
                >
                    <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                        <Layers3
                            aria-hidden="true"
                            className="size-[1.125rem] text-primary"
                        />
                        <h2
                            id="categories-heading"
                            className="text-lg font-extrabold tracking-tight"
                        >
                            Kategorije
                        </h2>
                    </div>
                    {error ? (
                        <div className="grid gap-3 p-2">
                            <Notice tone="danger">{error}</Notice>
                            {retry}
                        </div>
                    ) : !index ? (
                        <TreeSkeleton />
                    ) : index.children.has(null) ? (
                        <CategoryTree
                            index={index}
                            selectedId={selected ? selected.id : null}
                            labelledBy="categories-heading"
                            onSelect={selectCategory}
                        />
                    ) : (
                        <p className="px-3 pb-4 text-sm text-muted">
                            Trenutno nema dostupnih kategorija.
                        </p>
                    )}
                </section>
            </aside>

            <div className={cx(!detailView && 'max-lg:hidden')}>
                {!detailView ? (
                    <EmptyState
                        title="Odaberite kategoriju"
                        text="Zatim odaberite pripremljeni kviz ili sastavite vlastiti od pitanja iz te kategorije."
                    />
                ) : error ? (
                    <div className="grid gap-3">
                        <Notice tone="danger">{error}</Notice>
                        {retry}
                    </div>
                ) : !index ? (
                    <DetailSkeleton />
                ) : selected ? (
                    <CategoryDetail
                        key={selected.id}
                        category={selected}
                        index={index}
                        onSelect={selectCategory}
                    />
                ) : (
                    <EmptyState
                        title="Kategorija nije pronađena"
                        text="Možda više nije dostupna. Odaberite drugu kategoriju s popisa."
                        action={
                            <Button
                                variant="secondary"
                                onClick={() => selectCategory(null)}
                            >
                                Sve kategorije
                            </Button>
                        }
                    />
                )}
            </div>
        </div>
    );
}

function EmptyState({
    title,
    text,
    action,
}: {
    title: string;
    text: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="grid justify-items-center gap-3 rounded-[1.5rem] border-2 border-dashed border-white/40 bg-white/8 px-6 py-12 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-white text-primary">
                <FolderSearch aria-hidden="true" className="size-7" />
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
            <p className="max-w-sm text-white/90">{text}</p>
            {action}
        </div>
    );
}

function TreeSkeleton() {
    return (
        <div className="grid gap-1 px-1 pb-2">
            <span role="status" className="sr-only">
                Učitavanje kategorija…
            </span>
            {['w-3/4', 'w-1/2', 'w-2/3', 'w-3/5', 'w-2/5'].map((width) => (
                <div key={width} className="flex h-12 items-center gap-3 px-2">
                    <Skeleton className="size-5 rounded-md" />
                    <Skeleton className={cx('h-4', width)} />
                </div>
            ))}
        </div>
    );
}

function DetailSkeleton() {
    return (
        <div className="card grid gap-4 p-5 sm:p-7">
            <span role="status" className="sr-only">
                Učitavanje kategorije…
            </span>
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="mt-2 h-13 w-full rounded-2xl sm:w-60" />
        </div>
    );
}
