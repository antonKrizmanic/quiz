'use client';

import {
    ArrowRight,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    Layers3,
    RefreshCcw,
    Shuffle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useState } from 'react';
import { useConfig, useQuizApi } from '@/components/quiz/config-provider';
import { savePersonalSession } from '@/lib/quiz-session';
import type {
    PagedResponse,
    PublicQuestionCategory,
    PublicQuizCatalogItem,
} from '@/types/quiz-public';

export function CategoryBrowser() {
    const city = useConfig();
    const quizApi = useQuizApi();
    const router = useRouter();
    const [categories, setCategories] = useState<PublicQuestionCategory[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [expandedIds, setExpandedIds] = useState<number[]>([]);
    const [catalog, setCatalog] =
        useState<PagedResponse<PublicQuizCatalogItem> | null>(null);
    const [page, setPage] = useState(0);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingCatalog, setLoadingCatalog] = useState(false);
    const [categoriesError, setCategoriesError] = useState<string | null>(null);
    const [catalogError, setCatalogError] = useState<string | null>(null);
    const [personalOpen, setPersonalOpen] = useState(false);
    const [personName, setPersonName] = useState('');
    const [questionCount, setQuestionCount] = useState(10);
    const [personalBusy, setPersonalBusy] = useState(false);
    const [personalError, setPersonalError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        setLoadingCategories(true);
        setCategoriesError(null);
        quizApi
            .getCategories(city.cityAssociationId)
            .then((items) => {
                if (active) setCategories(items);
            })
            .catch((cause: unknown) => {
                if (active)
                    setCategoriesError(
                        cause instanceof Error
                            ? cause.message
                            : 'Kategorije nisu dostupne.',
                    );
            })
            .finally(() => {
                if (active) setLoadingCategories(false);
            });
        return () => {
            active = false;
        };
    }, [quizApi, city.cityAssociationId]);

    useEffect(() => {
        if (selectedId === null) return;
        let active = true;
        setLoadingCatalog(true);
        setCatalogError(null);
        quizApi
            .getCatalog(city.cityAssociationId, selectedId, page)
            .then((items) => {
                if (active) setCatalog(items);
            })
            .catch((cause: unknown) => {
                if (active)
                    setCatalogError(
                        cause instanceof Error
                            ? cause.message
                            : 'Kvizovi nisu dostupni.',
                    );
            })
            .finally(() => {
                if (active) setLoadingCatalog(false);
            });
        return () => {
            active = false;
        };
    }, [quizApi, city.cityAssociationId, selectedId, page]);

    const selected = categories.find((item) => item.id === selectedId);
    const byParent = new Map<number | null, PublicQuestionCategory[]>();
    for (const category of categories) {
        const siblings = byParent.get(category.parentCategoryId) ?? [];
        siblings.push(category);
        byParent.set(category.parentCategoryId, siblings);
    }

    function selectCategory(category: PublicQuestionCategory) {
        setSelectedId(category.id);
        setPage(0);
        setCatalog(null);
        setPersonalOpen(false);
        setPersonalError(null);
        if (byParent.has(category.id))
            setExpandedIds((current) =>
                current.includes(category.id)
                    ? current
                    : [...current, category.id],
            );
    }

    function renderCategories(parentId: number | null): React.ReactNode {
        const children = byParent.get(parentId) ?? [];
        if (children.length === 0) return null;
        return (
            <ul
                className={
                    parentId === null
                        ? 'space-y-2'
                        : 'mt-2 ml-5 space-y-2 border-l border-line pl-3'
                }
            >
                {children.map((category) => {
                    const hasChildren = byParent.has(category.id);
                    const expanded = expandedIds.includes(category.id);
                    return (
                        <li key={category.id}>
                            <div
                                className={`flex w-full items-center rounded-xl transition-colors ${selectedId === category.id ? 'bg-brand-soft font-semibold text-brand' : 'text-ink hover:bg-muted'}`}
                            >
                                {hasChildren ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExpandedIds((current) =>
                                                current.includes(category.id)
                                                    ? current.filter(
                                                        (id) =>
                                                            id !==
                                                            category.id,
                                                    )
                                                    : [...current, category.id],
                                            )
                                        }
                                        aria-label={`${expanded ? 'Sažmi' : 'Proširi'} ${category.name}`}
                                        aria-expanded={expanded}
                                        className="rounded-lg p-3 focus-visible:outline-2 focus-visible:outline-brand"
                                    >
                                        {expanded ? (
                                            <ChevronDown
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <ChevronRight
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </button>
                                ) : (
                                    <span className="w-10" />
                                )}
                                <button
                                    type="button"
                                    onClick={() => selectCategory(category)}
                                    aria-current={
                                        selectedId === category.id
                                            ? 'true'
                                            : undefined
                                    }
                                    className="flex min-w-0 flex-1 items-center gap-2 rounded-lg py-3 pr-3 text-left focus-visible:outline-2 focus-visible:outline-brand"
                                >
                                    <span className="min-w-0 flex-1">
                                        {category.name}
                                    </span>
                                    <span
                                        className="text-xs text-subtle"
                                        title={`${category.availableQuestionCount} dostupnih pitanja`}
                                    >
                                        {category.availableQuestionCount}
                                    </span>
                                </button>
                            </div>
                            {hasChildren &&
                                expanded &&
                                renderCategories(category.id)}
                        </li>
                    );
                })}
            </ul>
        );
    }

    async function startPersonal(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (
            !selected ||
            personalBusy ||
            !personName.trim() ||
            questionCount < 1 ||
            questionCount > 100
        )
            return;
        setPersonalBusy(true);
        setPersonalError(null);
        try {
            const started = await quizApi.startPersonal(
                city.cityAssociationId,
                selected.id,
                personName.trim(),
                questionCount,
            );
            savePersonalSession({
                attemptId: started.attemptId,
                accessToken: started.accessToken,
            });
            router.push(`/quiz/attempt/${started.attemptId}`);
        } catch (cause) {
            setPersonalError(
                cause instanceof Error
                    ? cause.message
                    : 'Kviz nije moguće sastaviti.',
            );
        } finally {
            setPersonalBusy(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="quiz-hero">
                <p className="quiz-eyebrow">{city.title}</p>
                <h1 className="mt-7 text-ink">{city.heroSection.title}</h1>
                <p className="quiz-hero-description">
                    {city.heroSection.description} Odaberite kategoriju i kviz
                    koji želite riješiti.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
                <section
                    aria-labelledby="category-title"
                    className="quiz-card p-5 shadow-panel sm:p-6"
                >
                    <div className="mb-5 flex items-center gap-3">
                        <Layers3
                            className="size-5 text-brand"
                            aria-hidden="true"
                        />
                        <h2
                            id="category-title"
                            className="quiz-section-title text-lg font-bold text-ink"
                        >
                            Kategorije
                        </h2>
                    </div>
                    {loadingCategories && (
                        <p role="status" className="text-sm text-subtle">
                            Učitavanje kategorija...
                        </p>
                    )}
                    {categoriesError && (
                        <div className="space-y-3">
                            <p role="alert" className="text-sm text-brand">
                                {categoriesError}
                            </p>
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-brand"
                            >
                                <RefreshCcw
                                    className="size-4"
                                    aria-hidden="true"
                                />{' '}
                                Pokušaj ponovno
                            </button>
                        </div>
                    )}
                    {!loadingCategories &&
                        !categoriesError &&
                        (categories.length > 0 ? (
                            renderCategories(null)
                        ) : (
                            <p className="text-sm text-subtle">
                                Trenutno nema dostupnih kategorija.
                            </p>
                        ))}
                </section>

                <div className="space-y-6">
                    {!selected ? (
                        <section className="quiz-card p-8 text-center shadow-panel sm:p-12">
                            <ClipboardList
                                className="mx-auto size-10 text-brand"
                                aria-hidden="true"
                            />
                            <h2 className="quiz-section-title mt-4 text-xl font-bold text-ink">
                                Odaberite kategoriju
                            </h2>
                            <p className="mt-2 text-subtle">
                                Zatim odaberite pripremljeni kviz ili sastavite
                                novi za sebe.
                            </p>
                        </section>
                    ) : (
                        <>
                            <section className="quiz-card p-6 shadow-panel sm:p-8">
                                <p className="quiz-eyebrow">
                                    Odabrana kategorija
                                </p>
                                <h2 className="quiz-section-title mt-5 text-2xl font-bold text-ink">
                                    {selected.name}
                                </h2>
                                <p className="mt-2 text-sm text-subtle">
                                    Dostupnih pitanja u kategoriji i
                                    potkategorijama:{' '}
                                    {selected.availableQuestionCount}
                                </p>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPersonalOpen((open) => !open)
                                    }
                                    disabled={
                                        selected.availableQuestionCount === 0
                                    }
                                    className="mt-5 inline-flex items-center gap-2 quiz-button-primary px-5 py-3 font-semibold text-on-brand hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Shuffle
                                        className="size-4"
                                        aria-hidden="true"
                                    />{' '}
                                    Sastavi mi kviz
                                </button>
                                {personalOpen && (
                                    <form
                                        onSubmit={(event) =>
                                            void startPersonal(event)
                                        }
                                        className="mt-6 grid gap-4 border-t border-line pt-6 sm:grid-cols-2"
                                    >
                                        <div>
                                            <label
                                                htmlFor="personal-name"
                                                className="block text-sm font-semibold text-ink"
                                            >
                                                Ime i prezime *
                                            </label>
                                            <input
                                                id="personal-name"
                                                required
                                                maxLength={200}
                                                autoComplete="name"
                                                value={personName}
                                                onChange={(event) =>
                                                    setPersonName(
                                                        event.target.value,
                                                    )
                                                }
                                                className="mt-2 w-full quiz-field px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="personal-count"
                                                className="block text-sm font-semibold text-ink"
                                            >
                                                Broj pitanja *
                                            </label>
                                            <input
                                                id="personal-count"
                                                required
                                                type="number"
                                                min={1}
                                                max={100}
                                                value={questionCount}
                                                onChange={(event) =>
                                                    setQuestionCount(
                                                        Number(
                                                            event.target.value,
                                                        ),
                                                    )
                                                }
                                                className="mt-2 w-full quiz-field px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft"
                                            />
                                        </div>
                                        {personalError && (
                                            <p
                                                role="alert"
                                                className="text-sm text-brand sm:col-span-2"
                                            >
                                                {personalError}
                                            </p>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={
                                                personalBusy ||
                                                !personName.trim()
                                            }
                                            className="inline-flex items-center justify-center gap-2 quiz-button-primary px-5 py-3 font-semibold text-on-brand hover:bg-brand-hover disabled:opacity-50 sm:col-span-2"
                                        >
                                            {personalBusy
                                                ? 'Sastavljanje...'
                                                : 'Započni svoj kviz'}{' '}
                                            <ArrowRight
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </form>
                                )}
                            </section>

                            <section
                                aria-labelledby="prepared-title"
                                className="space-y-4"
                            >
                                <div>
                                    <h2
                                        id="prepared-title"
                                        className="quiz-section-title text-xl font-bold text-ink"
                                    >
                                        Pripremljeni kvizovi
                                    </h2>
                                    <p className="mt-1 text-sm text-subtle">
                                        Kvizovi iz ove kategorije i njezinih
                                        potkategorija.
                                    </p>
                                </div>
                                {loadingCatalog && (
                                    <p
                                        role="status"
                                        className="quiz-card p-5 text-subtle"
                                    >
                                        Učitavanje kvizova...
                                    </p>
                                )}
                                {catalogError && (
                                    <p
                                        role="alert"
                                        className="rounded-2xl bg-brand-soft p-5 text-brand"
                                    >
                                        {catalogError}
                                    </p>
                                )}
                                {!loadingCatalog &&
                                    !catalogError &&
                                    catalog?.list.length === 0 && (
                                        <p className="quiz-card p-5 text-subtle">
                                            U ovoj kategoriji trenutačno nema
                                            objavljenih kvizova.
                                        </p>
                                    )}
                                {!loadingCatalog &&
                                    !catalogError &&
                                    catalog?.list.map((item) => (
                                        <Link
                                            key={item.quizId}
                                            href={`/quiz/take/${item.instanceId}/${encodeURIComponent(item.publicCode)}`}
                                            className="group quiz-card block p-5 transition-colors hover:border-brand sm:p-6"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="font-semibold text-ink group-hover:text-brand">
                                                        {item.name}
                                                    </h3>
                                                    {item.description && (
                                                        <p className="mt-2 text-sm text-subtle">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                    <p className="mt-3 text-xs font-medium text-subtle">
                                                        Broj pitanja:{' '}
                                                        {item.questionCount}
                                                    </p>
                                                </div>
                                                <ArrowRight
                                                    className="size-5 shrink-0 text-brand"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        </Link>
                                    ))}
                                {catalog && catalog.metadata.totalPages > 1 && (
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <button
                                            type="button"
                                            disabled={
                                                page === 0 || loadingCatalog
                                            }
                                            onClick={() =>
                                                setPage((value) => value - 1)
                                            }
                                            className="rounded-lg border border-field bg-card px-4 py-2 disabled:opacity-50"
                                        >
                                            Prethodna
                                        </button>
                                        <span>
                                            Stranica {page + 1} /{' '}
                                            {catalog.metadata.totalPages}
                                        </span>
                                        <button
                                            type="button"
                                            disabled={
                                                page >=
                                                catalog.metadata
                                                    .totalPages -
                                                1 || loadingCatalog
                                            }
                                            onClick={() =>
                                                setPage((value) => value + 1)
                                            }
                                            className="rounded-lg border border-field bg-card px-4 py-2 disabled:opacity-50"
                                        >
                                            Sljedeća
                                        </button>
                                    </div>
                                )}
                            </section>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
