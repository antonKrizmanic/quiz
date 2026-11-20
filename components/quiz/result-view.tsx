'use client';

import {
    ArrowRight,
    Check,
    CircleCheck,
    CircleX,
    Home,
    Lightbulb,
    RotateCcw,
    X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button, buttonClass } from '@/components/ui/button';
import { ScoreMeter } from '@/components/ui/progress';
import { Segmented } from '@/components/ui/segmented';
import { cx } from '@/lib/cx';
import { formatNumber, pointsLabel } from '@/lib/format';
import type { QuizQuestionResult, QuizResult } from '@/types/quiz-public';
import { QuestionType } from '@/types/quiz-public';

type Filter = 'all' | 'wrong' | 'right';

type ResultViewProps = {
    result: QuizResult;
    restartLabel: string;
    announce: boolean;
    onRestart: () => void;
};

export function ResultView({
    result,
    restartLabel,
    announce,
    onRestart,
}: ResultViewProps) {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const wrongCount = result.questions.filter(
        (item) => !item.isCorrect,
    ).length;
    const rightCount = result.questions.length - wrongCount;
    const [filter, setFilter] = useState<Filter>(
        wrongCount > 0 ? 'wrong' : 'all',
    );
    const visible = result.questions
        .map((item, index) => ({ item, number: index + 1 }))
        .filter(
            ({ item }) =>
                filter === 'all' ||
                (filter === 'wrong' ? !item.isCorrect : item.isCorrect),
        );
    const passed = result.passed;
    const tone = passed === false ? 'primary' : 'success';

    useEffect(() => {
        if (!announce) return;
        window.scrollTo({ top: 0, behavior: 'instant' });
        headingRef.current?.focus({ preventScroll: true });
    }, [announce]);

    return (
        <div className="mx-auto grid max-w-2xl gap-6">
            <section className="card relative isolate overflow-hidden px-5 py-7 sm:px-8 sm:py-9">
                <span
                    aria-hidden="true"
                    className={cx(
                        'absolute -top-24 -right-20 -z-10 size-64 rounded-full border-[48px]',
                        tone === 'success'
                            ? 'border-success/8'
                            : 'border-primary/6',
                    )}
                />
                <p className="text-sm font-bold text-primary">
                    Kviz je završen
                </p>
                <h1
                    ref={headingRef}
                    tabIndex={-1}
                    className="mt-1 text-2xl font-extrabold tracking-tight text-balance outline-none sm:text-3xl"
                >
                    {result.quizName || 'Vaš rezultat'}
                </h1>

                <div className="mt-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                    <p className="text-5xl font-extrabold tracking-tight tabular-nums">
                        {formatNumber(result.score)}
                        <span className="ml-2 text-2xl font-semibold text-muted">
                            / {formatNumber(result.maximumScore)}
                        </span>
                    </p>
                    <p className="pb-1 text-2xl font-bold text-muted tabular-nums">
                        {formatNumber(result.percentage)}%
                    </p>
                </div>
                <ScoreMeter
                    className="mt-4"
                    value={result.percentage}
                    max={100}
                    tone={tone}
                    label="Uspješnost"
                    valueLabel={`${formatNumber(result.percentage)} %`}
                />

                <div className="mt-5 flex flex-wrap items-center gap-2 text-sm font-semibold">
                    {passed !== null && (
                        <span
                            className={cx(
                                'inline-flex items-center gap-1.5 rounded-full px-3 py-1',
                                passed
                                    ? 'bg-success-soft text-success'
                                    : 'bg-danger-soft text-danger',
                            )}
                        >
                            {passed ? (
                                <CircleCheck
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            ) : (
                                <CircleX
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            )}
                            {passed ? 'Položeno' : 'Nije položeno'}
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sunken px-3 py-1 text-fg">
                        <Check
                            aria-hidden="true"
                            className="size-4 text-success"
                        />
                        Točno: {rightCount}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sunken px-3 py-1 text-fg">
                        <X aria-hidden="true" className="size-4 text-danger" />
                        Netočno: {wrongCount}
                    </span>
                </div>

                <div className="mt-7 flex flex-col gap-2 sm:flex-row">
                    <Button size="lg" className="sm:flex-1" onClick={onRestart}>
                        <RotateCcw aria-hidden="true" />
                        {restartLabel}
                    </Button>
                    <Link
                        href="/"
                        className={cx(
                            buttonClass({ variant: 'secondary', size: 'lg' }),
                            'sm:flex-1',
                        )}
                    >
                        <Home aria-hidden="true" />
                        Početna stranica
                    </Link>
                </div>
            </section>

            <section aria-labelledby="review-heading" className="grid gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                    <h2 id="review-heading" className="text-lg font-bold">
                        Pregled odgovora
                    </h2>
                    <Segmented<Filter>
                        aria-label="Prikaži pitanja"
                        value={filter}
                        onValueChange={setFilter}
                        className="max-sm:w-full"
                        block
                        items={[
                            {
                                value: 'all',
                                label: `Sva (${result.questions.length})`,
                            },
                            {
                                value: 'wrong',
                                label: `Netočna (${wrongCount})`,
                            },
                            { value: 'right', label: `Točna (${rightCount})` },
                        ]}
                    />
                </div>

                {visible.length === 0 ? (
                    <p className="card px-5 py-6 text-center text-muted">
                        {filter === 'wrong'
                            ? 'Sve ste odgovorili točno. Bravo!'
                            : 'Nema točnih odgovora za prikaz.'}
                    </p>
                ) : (
                    <ol className="grid gap-3">
                        {visible.map(({ item, number }) => (
                            <li key={item.question.id}>
                                <ReviewCard item={item} number={number} />
                            </li>
                        ))}
                    </ol>
                )}

                <Link
                    href="/"
                    className={cx(
                        buttonClass({ variant: 'ghost' }),
                        'justify-self-center text-primary',
                    )}
                >
                    Pogledajte ostale kvizove
                    <ArrowRight aria-hidden="true" />
                </Link>
            </section>
        </div>
    );
}

function ReviewCard({
    item,
    number,
}: {
    item: QuizQuestionResult;
    number: number;
}) {
    return (
        <article className="card p-4 sm:p-6">
            <div className="flex items-start gap-3">
                <span
                    className={cx(
                        'grid size-8 shrink-0 place-items-center rounded-full',
                        item.isCorrect
                            ? 'bg-success-soft text-success'
                            : 'bg-danger-soft text-danger',
                    )}
                >
                    {item.isCorrect ? (
                        <Check
                            aria-hidden="true"
                            strokeWidth={3}
                            className="size-4"
                        />
                    ) : (
                        <X
                            aria-hidden="true"
                            strokeWidth={3}
                            className="size-4"
                        />
                    )}
                    <span className="sr-only">
                        {item.isCorrect ? 'Točno' : 'Netočno'}
                    </span>
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-muted">
                        Pitanje {number} ·{' '}
                        <span className="tabular-nums">
                            {formatNumber(item.score)} /{' '}
                            {pointsLabel(item.question.maximumPoints)}
                        </span>
                    </p>
                    <h3 className="mt-1 font-semibold leading-snug text-pretty">
                        {item.question.text}
                    </h3>
                </div>
            </div>
            <div className="mt-4">
                <AnswerReview item={item} />
            </div>
            {item.explanation && (
                <div className="mt-4 flex gap-3 rounded-2xl bg-sunken p-3.5 text-sm">
                    <Lightbulb
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-primary"
                    />
                    <p>
                        <span className="font-semibold">Objašnjenje: </span>
                        <span className="text-muted">{item.explanation}</span>
                    </p>
                </div>
            )}
        </article>
    );
}

function AnswerReview({ item }: { item: QuizQuestionResult }) {
    const { question } = item;

    if (
        question.type === QuestionType.SingleAnswer ||
        question.type === QuestionType.MultipleAnswers
    ) {
        return (
            <ul className="grid gap-2">
                {question.choices.map((choice) => {
                    const selected = question.selectedChoiceIds.includes(
                        choice.id,
                    );
                    const correct = item.correctChoiceIds.includes(choice.id);
                    return (
                        <li
                            key={choice.id}
                            className={cx(
                                'flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-sm',
                                correct
                                    ? 'border-success/40 bg-success-soft'
                                    : selected
                                      ? 'border-danger/40 bg-danger-soft'
                                      : 'border-line',
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={cx(
                                    'mt-px',
                                    correct
                                        ? 'text-success'
                                        : selected
                                          ? 'text-danger'
                                          : 'text-muted',
                                )}
                            >
                                {correct ? (
                                    <Check className="size-4" strokeWidth={3} />
                                ) : selected ? (
                                    <X className="size-4" strokeWidth={3} />
                                ) : (
                                    <span className="block size-4" />
                                )}
                            </span>
                            <span className="min-w-0 flex-1 text-fg">
                                {choice.text}
                            </span>
                            <span className="flex shrink-0 flex-wrap justify-end gap-1 text-xs font-bold">
                                {selected && (
                                    <span className="rounded-full bg-surface px-2 py-0.5 text-fg">
                                        Vaš odabir
                                    </span>
                                )}
                                {correct && (
                                    <span className="rounded-full bg-surface px-2 py-0.5 text-success">
                                        Točno
                                    </span>
                                )}
                            </span>
                        </li>
                    );
                })}
            </ul>
        );
    }

    if (question.type === QuestionType.TextAnswer) {
        return (
            <dl className="grid gap-2 text-sm">
                <div
                    className={cx(
                        'rounded-xl border px-3 py-2.5',
                        item.isCorrect
                            ? 'border-success/40 bg-success-soft'
                            : 'border-danger/40 bg-danger-soft',
                    )}
                >
                    <dt className="text-xs font-bold text-muted">
                        Vaš odgovor
                    </dt>
                    <dd className="mt-0.5 text-fg">
                        {question.textAnswer?.trim() || 'Bez odgovora'}
                    </dd>
                </div>
                <div className="rounded-xl border border-line px-3 py-2.5">
                    <dt className="text-xs font-bold text-muted">
                        Prihvaćeni odgovori
                    </dt>
                    <dd className="mt-0.5 text-fg">
                        {item.acceptedTextAnswers.join(', ') || '—'}
                    </dd>
                </div>
            </dl>
        );
    }

    return (
        <ul className="grid gap-2 text-sm">
            {question.leftOptions.map((left) => {
                const selectedId = question.selectedMatches.find(
                    (match) => match.leftOptionId === left.id,
                )?.rightOptionId;
                const correctId = item.correctMatches.find(
                    (match) => match.leftOptionId === left.id,
                )?.rightOptionId;
                const textOf = (id: string | undefined) =>
                    question.rightOptions.find((option) => option.id === id)
                        ?.text;
                const ok = selectedId !== undefined && selectedId === correctId;
                return (
                    <li
                        key={left.id}
                        className={cx(
                            'rounded-xl border px-3 py-2.5',
                            ok
                                ? 'border-success/40 bg-success-soft'
                                : 'border-danger/40 bg-danger-soft',
                        )}
                    >
                        <p className="font-semibold text-fg">{left.text}</p>
                        <p className="mt-0.5 flex items-start gap-1.5 text-fg">
                            {ok ? (
                                <Check
                                    aria-hidden="true"
                                    strokeWidth={3}
                                    className="mt-0.5 size-4 shrink-0 text-success"
                                />
                            ) : (
                                <X
                                    aria-hidden="true"
                                    strokeWidth={3}
                                    className="mt-0.5 size-4 shrink-0 text-danger"
                                />
                            )}
                            <span>
                                <span className="sr-only">Vaš par: </span>
                                {textOf(selectedId) ?? 'Bez odgovora'}
                            </span>
                        </p>
                        {!ok && (
                            <p className="mt-1 pl-5.5 font-medium text-success">
                                Točno: {textOf(correctId)}
                            </p>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
