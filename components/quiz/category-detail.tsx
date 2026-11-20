'use client';

import { Button as BaseButton } from '@ui-sdk/react/button';
import {
    ArrowLeft,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useConfig, useQuizApi } from '@/components/quiz/config-provider';
import { Button, PendingIcon } from '@/components/ui/button';
import { Notice } from '@/components/ui/notice';
import { Skeleton } from '@/components/ui/skeleton';
import {
    ancestorsOf,
    type CategoryIndex,
    errorMessage,
} from '@/lib/categories';
import { questionsLabel, quizzesLabel } from '@/lib/format';
import type {
    PublicQuestionCategory,
    PublicQuizCatalogItem,
} from '@/types/quiz-public';
import { PersonalQuizSheet } from './personal-quiz-sheet';

type CategoryDetailProps = {
    category: PublicQuestionCategory;
    index: CategoryIndex;
    onSelect: (id: number | null) => void;
};

export function CategoryDetail({
    category,
    index,
    onSelect,
}: CategoryDetailProps) {
    const path = ancestorsOf(index, category.id);
    const subcategories = index.children.get(category.id) ?? [];

    return (
        <div className="grid gap-4 sm:gap-5">
            <div className="lg:hidden">
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2"
                    onClick={() => onSelect(null)}
                >
                    <ArrowLeft aria-hidden="true" />
                    Sve kategorije
                </Button>
            </div>

            <section
                aria-labelledby="category-heading"
                className="card p-5 sm:p-7"
            >
                {path.length > 0 && (
                    <nav aria-label="Nadređene kategorije" className="mb-2">
                        <ol className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sm text-muted">
                            {path.map((parent) => (
                                <li
                                    key={parent.id}
                                    className="flex items-center gap-1"
                                >
                                    <BaseButton
                                        onClick={() => onSelect(parent.id)}
                                        className="rounded-md py-1 font-medium hover:text-primary hover:underline"
                                    >
                                        {parent.name}
                                    </BaseButton>
                                    <ChevronRight
                                        aria-hidden="true"
                                        className="size-3.5"
                                    />
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}
                <h2
                    id="category-heading"
                    className="text-2xl font-extrabold tracking-tight text-balance sm:text-3xl"
                >
                    {category.name}
                </h2>
                <p className="mt-1.5 text-muted">
                    {questionsLabel(category.availableQuestionCount)} u
                    kategoriji
                    {subcategories.length > 0 ? ' i potkategorijama' : ''}
                </p>

                {subcategories.length > 0 && (
                    <div className="mt-5">
                        <h3 className="text-xs font-bold tracking-wide text-muted uppercase">
                            Potkategorije
                        </h3>
                        <ul className="mt-2 flex flex-wrap gap-2">
                            {subcategories.map((child) => (
                                <li key={child.id}>
                                    <BaseButton
                                        onClick={() => onSelect(child.id)}
                                        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-surface px-3.5 text-sm font-semibold text-fg transition-colors hover:border-primary hover:text-primary active:scale-[0.98]"
                                    >
                                        {child.name}
                                        <span className="text-xs font-semibold text-muted tabular-nums">
                                            <span aria-hidden="true">
                                                {child.availableQuestionCount}
                                            </span>
                                            <span className="sr-only">
                                                ,{' '}
                                                {questionsLabel(
                                                    child.availableQuestionCount,
                                                )}
                                            </span>
                                        </span>
                                    </BaseButton>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-6 sm:max-w-xs">
                    <PersonalQuizSheet category={category} />
                </div>
            </section>

            <PreparedQuizzes category={category} />
        </div>
    );
}

type CatalogState = {
    items: PublicQuizCatalogItem[];
    page: number;
    totalPages: number;
    totalRecords: number;
};

function PreparedQuizzes({ category }: { category: PublicQuestionCategory }) {
    const city = useConfig();
    const quizApi = useQuizApi();
    const [catalog, setCatalog] = useState<CatalogState | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadPage = useCallback(
        async (page: number) => {
            setError(null);
            try {
                const response = await quizApi.getCatalog(
                    city.cityAssociationId,
                    category.id,
                    page,
                );
                setCatalog((current) => {
                    const previous = page === 0 ? [] : (current?.items ?? []);
                    const known = new Set(
                        previous.map((item) => item.instanceId),
                    );
                    return {
                        items: [
                            ...previous,
                            ...response.list.filter(
                                (item) => !known.has(item.instanceId),
                            ),
                        ],
                        page,
                        totalPages: response.metadata.totalPages,
                        totalRecords: response.metadata.totalRecords,
                    };
                });
            } catch (cause) {
                setError(errorMessage(cause, 'Kvizovi nisu dostupni.'));
            }
        },
        [quizApi, city.cityAssociationId, category.id],
    );

    useEffect(() => {
        void loadPage(0);
    }, [loadPage]);

    const nextPage = catalog ? catalog.page + 1 : 0;

    return (
        <section aria-labelledby="prepared-heading" className="grid gap-3">
            <div className="flex items-baseline justify-between gap-3 px-1 pt-2">
                <h2 id="prepared-heading" className="text-lg font-bold">
                    Pripremljeni kvizovi
                </h2>
                {catalog && catalog.totalRecords > 0 && (
                    <span className="text-sm text-muted">
                        {quizzesLabel(catalog.totalRecords)}
                    </span>
                )}
            </div>

            {!catalog && !error && <CatalogSkeleton />}

            {catalog?.items.length === 0 && (
                <p className="card px-5 py-6 text-center text-muted">
                    U ovoj kategoriji trenutačno nema objavljenih kvizova.
                    Sastavite svoj kviz iz njezinih pitanja.
                </p>
            )}

            {catalog && catalog.items.length > 0 && (
                <ul className="grid gap-3">
                    {catalog.items.map((item) => (
                        <li key={item.instanceId}>
                            <QuizCard item={item} />
                        </li>
                    ))}
                </ul>
            )}

            {error && (
                <Notice tone="danger">
                    <p>{error}</p>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="mt-3"
                        onClick={() => loadPage(nextPage)}
                    >
                        <PendingIcon icon={RefreshCw} />
                        Pokušaj ponovno
                    </Button>
                </Notice>
            )}

            {catalog && !error && nextPage < catalog.totalPages && (
                <Button
                    variant="secondary"
                    block
                    onClick={() => loadPage(nextPage)}
                    pendingAnnouncement="Učitavanje kvizova"
                >
                    <PendingIcon icon={ChevronDown} />
                    Prikaži još kvizova
                </Button>
            )}
        </section>
    );
}

function QuizCard({ item }: { item: PublicQuizCatalogItem }) {
    return (
        <Link
            href={`/quiz/take/${item.instanceId}/${encodeURIComponent(item.publicCode)}`}
            className="group card flex items-center gap-4 p-4 transition-[border-color,scale] duration-150 hover:border-primary/60 active:scale-[0.99] motion-reduce:transition-none sm:p-5"
        >
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                <ClipboardList aria-hidden="true" className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block font-semibold leading-snug text-fg group-hover:text-primary">
                    {item.name}
                </span>
                {item.description && (
                    <span className="mt-0.5 line-clamp-2 text-sm text-muted">
                        {item.description}
                    </span>
                )}
                <span className="mt-1.5 block text-xs font-semibold text-muted">
                    {questionsLabel(item.questionCount)}
                </span>
            </span>
            <ChevronRight
                aria-hidden="true"
                className="size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
            />
        </Link>
    );
}

function CatalogSkeleton() {
    return (
        <div className="grid gap-3">
            <span role="status" className="sr-only">
                Učitavanje kvizova…
            </span>
            {[0, 1, 2].map((key) => (
                <div key={key} className="card flex items-center gap-4 p-4">
                    <Skeleton className="size-11 rounded-2xl" />
                    <div className="grid flex-1 gap-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}
