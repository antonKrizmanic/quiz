'use client';

import { Radio, RadioGroup, RadioIndicator } from '@ui-sdk/react/radio';
import { ChevronRight, Unlink } from 'lucide-react';
import { useState } from 'react';
import { Button, buttonClass } from '@/components/ui/button';
import {
    createSheetController,
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cx } from '@/lib/cx';
import type { PublicQuizQuestion, QuizAnswer } from '@/types/quiz-public';

type MatchTermQuestionProps = {
    question: PublicQuizQuestion;
    answer: QuizAnswer;
    onChange: (answer: QuizAnswer) => void;
};

export function MatchTermQuestion({
    question,
    answer,
    onChange,
}: MatchTermQuestionProps) {
    const [sheet] = useState(() => createSheetController());
    const [activeId, setActiveId] = useState<string | null>(null);
    const [filling, setFilling] = useState(false);
    const { leftOptions, rightOptions } = question;

    const rightFor = (leftId: string) =>
        answer.matches.find((match) => match.leftOptionId === leftId)
            ?.rightOptionId ?? null;
    const leftFor = (rightId: string) =>
        answer.matches.find((match) => match.rightOptionId === rightId)
            ?.leftOptionId ?? null;
    const textOf = (options: typeof leftOptions, id: string | null) =>
        options.find((option) => option.id === id)?.text ?? null;

    const matchedCount = leftOptions.filter((left) => rightFor(left.id)).length;
    const activeIndex = leftOptions.findIndex((left) => left.id === activeId);
    const active = leftOptions[activeIndex] ?? null;

    function assign(leftId: string, rightId: string | null) {
        const matches = answer.matches.filter(
            (match) =>
                match.leftOptionId !== leftId &&
                (rightId === null || match.rightOptionId !== rightId),
        );
        if (rightId)
            matches.push({ leftOptionId: leftId, rightOptionId: rightId });
        onChange({ choiceOptionIds: [], text: null, matches });
        return matches;
    }

    function choose(rightId: string, closeAfter: boolean) {
        if (!active) return;
        const matches = assign(active.id, rightId);
        if (!closeAfter) return;
        const next = filling
            ? [
                  ...leftOptions.slice(activeIndex + 1),
                  ...leftOptions.slice(0, activeIndex),
              ].find(
                  (left) =>
                      !matches.some((match) => match.leftOptionId === left.id),
              )
            : undefined;
        if (next) setActiveId(next.id);
        else sheet.close();
    }

    return (
        <div className="grid gap-3">
            <p className="text-sm font-medium text-muted" aria-live="polite">
                Povezano {matchedCount} od {leftOptions.length}
            </p>
            <Sheet controller={sheet}>
                <ul className="grid gap-2.5">
                    {leftOptions.map((left, index) => {
                        const rightText = textOf(
                            rightOptions,
                            rightFor(left.id),
                        );
                        return (
                            <li key={left.id}>
                                <SheetTrigger
                                    onClick={() => {
                                        setActiveId(left.id);
                                        setFilling(!rightText);
                                    }}
                                    className={cx(
                                        'group flex min-h-16 w-full items-center gap-3 rounded-2xl border bg-surface p-3 pr-3.5 text-left transition-[border-color,background-color,scale] duration-150 hover:border-control active:scale-[0.99] motion-reduce:transition-none',
                                        rightText
                                            ? 'border-primary/50'
                                            : 'border-line',
                                    )}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={cx(
                                            'grid size-9 shrink-0 place-items-center rounded-xl text-sm font-bold',
                                            rightText
                                                ? 'bg-primary text-on-primary'
                                                : 'bg-sunken text-muted',
                                        )}
                                    >
                                        {index + 1}
                                    </span>
                                    <span className="grid min-w-0 flex-1 gap-0.5">
                                        <span className="font-semibold leading-snug text-fg">
                                            {left.text}
                                        </span>
                                        <span
                                            className={cx(
                                                'text-sm leading-snug',
                                                rightText
                                                    ? 'font-medium text-primary'
                                                    : 'text-muted',
                                            )}
                                        >
                                            {rightText ? (
                                                <>
                                                    <span className="sr-only">
                                                        Par:{' '}
                                                    </span>
                                                    {rightText}
                                                </>
                                            ) : (
                                                'Odaberite par'
                                            )}
                                        </span>
                                    </span>
                                    <ChevronRight
                                        aria-hidden="true"
                                        className="size-5 shrink-0 text-muted"
                                    />
                                </SheetTrigger>
                            </li>
                        );
                    })}
                </ul>

                <SheetContent
                    title={active?.text ?? 'Odaberite par'}
                    description={
                        active
                            ? `Pojam ${activeIndex + 1} od ${leftOptions.length}. Odaberite odgovarajući par.`
                            : undefined
                    }
                    footer={
                        <div className="flex gap-2">
                            {active && rightFor(active.id) && (
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="flex-1"
                                    onClick={() => assign(active.id, null)}
                                >
                                    <Unlink aria-hidden="true" />
                                    Ukloni par
                                </Button>
                            )}
                            <SheetClose
                                className={cx(
                                    buttonClass({ size: 'lg' }),
                                    'flex-1',
                                )}
                            >
                                Gotovo
                            </SheetClose>
                        </div>
                    }
                >
                    {active && (
                        <RadioGroup
                            key={active.id}
                            aria-label={`Par za pojam ${active.text}`}
                            value={rightFor(active.id)}
                            onValueChange={(value, details) => {
                                if (value)
                                    choose(
                                        value,
                                        details.reason === 'item-press',
                                    );
                            }}
                            className="grid gap-2"
                        >
                            {rightOptions.map((right) => {
                                const owner = leftFor(right.id);
                                const ownerText =
                                    owner && owner !== active.id
                                        ? textOf(leftOptions, owner)
                                        : null;
                                return (
                                    <label
                                        key={right.id}
                                        className="group flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 transition-colors hover:border-control has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary has-data-checked:border-primary has-data-checked:bg-primary-soft"
                                    >
                                        <span className="grid min-w-0 flex-1 gap-0.5">
                                            <span className="leading-snug text-fg">
                                                {right.text}
                                            </span>
                                            {ownerText && (
                                                <span className="text-xs text-muted">
                                                    Trenutno uz: {ownerText}
                                                </span>
                                            )}
                                        </span>
                                        <Radio
                                            value={right.id}
                                            className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-control bg-surface focus-visible:outline-none data-checked:border-primary"
                                        >
                                            <RadioIndicator className="size-3 rounded-full bg-primary" />
                                        </Radio>
                                    </label>
                                );
                            })}
                        </RadioGroup>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
