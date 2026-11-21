'use client';

import { Button } from '@ui-sdk/react/button';
import { Meter, MeterIndicator, MeterTrack } from '@ui-sdk/react/meter';
import {
    ArrowRight,
    Check,
    ChevronDown,
    Home,
    Lightbulb,
    RotateCcw,
    X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Segmented } from '@/components/ui/segmented';
import { cx } from '@/lib/cx';
import { formatNumber, pointsLabel } from '@/lib/format';
import { storyFinale } from '@/lib/story';
import type { QuizQuestionResult, QuizResult } from '@/types/quiz-public';
import { QuestionType } from '@/types/quiz-public';
import {
    StoryCloseLink,
    StorySegments,
    StoryShell,
    storyButton,
} from './story-shell';

type Filter = 'all' | 'wrong' | 'right';

type ResultViewProps = {
    result: QuizResult;
    restartLabel: string;
    announce: boolean;
    onRestart: () => void;
};

const verdict = (passed: boolean | null) =>
    passed === true
        ? 'Položeno!'
        : passed === false
          ? 'Ovaj put nije prošlo'
          : 'Kviz je završen';

export function ResultView({
    result,
    restartLabel,
    announce,
    onRestart,
}: ResultViewProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const total = result.questions.length;
    const wrongCount = result.questions.filter(
        (item) => !item.isCorrect,
    ).length;
    const rightCount = total - wrongCount;
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

    useEffect(() => {
        if (!announce) return;
        scrollRef.current?.scrollTo({ top: 0 });
        headingRef.current?.focus({ preventScroll: true });
    }, [announce]);

    return (
        <StoryShell
            color={storyFinale(result.passed)}
            title={result.quizName || 'Kviz Crvenog križa'}
            subtitle={`Točno ${rightCount} od ${total}`}
            watermark={String(Math.round(result.percentage))}
            scrollRef={scrollRef}
            progress={
                <div
                    aria-hidden="true"
                    className="flex h-1.5 items-center gap-1"
                >
                    <StorySegments
                        segments={result.questions.map((item) => ({
                            key: item.question.id,
                            fill: item.isCorrect ? 'solid' : 'faint',
                        }))}
                    />
                </div>
            }
            actions={<StoryCloseLink />}
        >
            <section className="flex min-h-[calc(100dvh-12rem)] flex-col justify-center gap-5 py-6 sm:min-h-[34rem]">
                <p className="self-start rounded-full bg-white/16 px-3 py-1.5 text-[0.8125rem] font-bold tracking-wide">
                    Rezultat
                </p>
                <h1
                    ref={headingRef}
                    tabIndex={-1}
                    className="text-[2.25rem] leading-[1.04] font-extrabold tracking-tight text-balance outline-none"
                >
                    {verdict(result.passed)}
                </h1>

                <p className="flex items-end gap-3 tabular-nums">
                    <span className="text-[6.5rem] leading-[0.8] font-extrabold tracking-[-0.05em]">
                        {formatNumber(result.score)}
                    </span>
                    <span className="pb-1 text-3xl font-bold text-white/75">
                        / {formatNumber(result.maximumScore)}
                    </span>
                    <span className="sr-only">bodova</span>
                </p>
                <Meter
                    aria-label="Uspješnost"
                    value={result.percentage}
                    min={0}
                    max={100}
                    getValueLabel={() =>
                        `${formatNumber(result.percentage)} posto`
                    }
                >
                    <MeterTrack className="h-3 overflow-hidden rounded-full bg-white/22">
                        <MeterIndicator className="h-full rounded-full bg-white" />
                    </MeterTrack>
                </Meter>
                <p className="flex flex-wrap gap-x-4 gap-y-1 text-[0.9375rem] font-bold text-white/90 tabular-nums">
                    <span>{formatNumber(result.percentage)} %</span>
                    <span className="flex items-center gap-1.5">
                        <Check aria-hidden="true" className="size-4" />
                        Točno {rightCount}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <X aria-hidden="true" className="size-4" />
                        Netočno {wrongCount}
                    </span>
                </p>

                <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                    <Button
                        onClick={onRestart}
                        className={storyButton({ block: true })}
                    >
                        <RotateCcw aria-hidden="true" />
                        {restartLabel}
                    </Button>
                    <Link
                        href="/"
                        className={storyButton({
                            variant: 'outline',
                            block: true,
                        })}
                    >
                        <Home aria-hidden="true" />
                        Početna
                    </Link>
                </div>
                <p
                    aria-hidden="true"
                    className="mt-2 flex items-center justify-center gap-1.5 text-[0.8125rem] font-semibold text-white/80"
                >
                    Pregled odgovora
                    <ChevronDown className="size-4" />
                </p>
            </section>

            <section aria-labelledby="review-heading" className="grid gap-3">
                <h2
                    id="review-heading"
                    className="text-xl font-extrabold tracking-tight"
                >
                    Pregled odgovora
                </h2>
                <Segmented<Filter>
                    aria-label="Prikaži pitanja"
                    tone="story"
                    block
                    value={filter}
                    onValueChange={setFilter}
                    items={[
                        { value: 'all', label: `Sva (${total})` },
                        { value: 'wrong', label: `Netočna (${wrongCount})` },
                        { value: 'right', label: `Točna (${rightCount})` },
                    ]}
                />

                {visible.length === 0 ? (
                    <p className="rounded-[1.25rem] bg-white/16 px-5 py-6 text-center font-semibold">
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
                    className="flex min-h-12 items-center justify-center gap-2 justify-self-center px-4 font-bold text-white underline-offset-4 hover:underline"
                >
                    Pogledajte ostale kvizove
                    <ArrowRight aria-hidden="true" className="size-5" />
                </Link>
            </section>
        </StoryShell>
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
        <article className="rounded-[1.5rem] bg-white p-4 text-fg sm:p-5">
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
                    <h3 className="mt-1 font-bold leading-snug text-pretty">
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
                        <span className="font-bold">Objašnjenje: </span>
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
                            <span className="min-w-0 flex-1">
                                {choice.text}
                            </span>
                            <span className="flex shrink-0 flex-wrap justify-end gap-1 text-xs font-bold">
                                {selected && (
                                    <span className="rounded-full bg-white px-2 py-0.5">
                                        Vaš odabir
                                    </span>
                                )}
                                {correct && (
                                    <span className="rounded-full bg-white px-2 py-0.5 text-success">
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
                    <dd className="mt-0.5">
                        {question.textAnswer?.trim() || 'Bez odgovora'}
                    </dd>
                </div>
                <div className="rounded-xl border border-line px-3 py-2.5">
                    <dt className="text-xs font-bold text-muted">
                        Prihvaćeni odgovori
                    </dt>
                    <dd className="mt-0.5">
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
                        <p className="font-bold">{left.text}</p>
                        <p className="mt-0.5 flex items-start gap-1.5">
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
                            <p className="mt-1 pl-5.5 font-semibold text-success">
                                Točno: {textOf(correctId)}
                            </p>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
