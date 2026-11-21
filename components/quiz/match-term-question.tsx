'use client';

import { Button } from '@ui-sdk/react/button';
import { Toggle } from '@ui-sdk/react/toggle';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { cx } from '@/lib/cx';
import type { PublicQuizQuestion, QuizAnswer } from '@/types/quiz-public';

type MatchTermQuestionProps = {
    question: PublicQuizQuestion;
    answer: QuizAnswer;
    onChange: (answer: QuizAnswer) => void;
};

type Side = 'left' | 'right';

const chip =
    'flex min-h-16 w-full items-center rounded-[1.125rem] px-3.5 py-3 text-left text-[0.9375rem] leading-snug font-bold transition-[background-color,color,box-shadow,scale] duration-150 active:scale-[0.98] motion-reduce:transition-none';

export function MatchTermQuestion({
    question,
    answer,
    onChange,
}: MatchTermQuestionProps) {
    const [pending, setPending] = useState<{ side: Side; id: string } | null>(
        null,
    );
    const { leftOptions, rightOptions } = question;

    const rightFor = (leftId: string) =>
        answer.matches.find((match) => match.leftOptionId === leftId)
            ?.rightOptionId;
    const pairs = leftOptions.flatMap((left, index) => {
        const right = rightOptions.find(
            (option) => option.id === rightFor(left.id),
        );
        return right ? [{ left, right, number: index + 1 }] : [];
    });
    const freeLeft = leftOptions.filter((left) => !rightFor(left.id));
    const freeRight = rightOptions.filter(
        (right) =>
            !answer.matches.some((match) => match.rightOptionId === right.id),
    );
    const pendingText = pending
        ? (pending.side === 'left' ? leftOptions : rightOptions).find(
              (option) => option.id === pending.id,
          )?.text
        : null;

    function setMatches(matches: QuizAnswer['matches']) {
        onChange({ choiceOptionIds: [], text: null, matches });
    }

    function pick(side: Side, id: string) {
        if (!pending || pending.side === side) {
            setPending(pending?.id === id ? null : { side, id });
            return;
        }
        const leftId = side === 'left' ? id : pending.id;
        const rightId = side === 'right' ? id : pending.id;
        setMatches([
            ...answer.matches.filter(
                (match) =>
                    match.leftOptionId !== leftId &&
                    match.rightOptionId !== rightId,
            ),
            { leftOptionId: leftId, rightOptionId: rightId },
        ]);
        setPending(null);
    }

    function unpair(leftId: string) {
        setMatches(
            answer.matches.filter((match) => match.leftOptionId !== leftId),
        );
    }

    return (
        <div className="grid gap-4">
            <p
                aria-live="polite"
                className="text-xs font-extrabold tracking-[0.08em] text-white/85 uppercase"
            >
                Povezano {pairs.length} od {leftOptions.length}
                {pendingText && (
                    <span className="sr-only">
                        . Odabrano: {pendingText}. Sada odaberite{' '}
                        {pending?.side === 'left' ? 'odgovor' : 'pojam'}.
                    </span>
                )}
            </p>

            {pairs.length > 0 && (
                <ul className="grid gap-2">
                    {pairs.map(({ left, right, number }) => (
                        <li
                            key={left.id}
                            className="flex items-center gap-3 rounded-[1.125rem] bg-white py-1.5 pr-1.5 pl-3 text-ink"
                        >
                            <span
                                aria-hidden="true"
                                className="grid size-7 shrink-0 place-items-center rounded-full bg-(--story) text-[0.8125rem] font-extrabold text-white"
                            >
                                {number}
                            </span>
                            <p className="min-w-0 flex-1 py-1.5 text-[0.9375rem] leading-snug font-bold">
                                {left.text}{' '}
                                <span className="font-semibold text-ink/65">
                                    → {right.text}
                                </span>
                            </p>
                            <Button
                                aria-label={`Ukloni par ${left.text}`}
                                onClick={() => unpair(left.id)}
                                className="grid size-11 shrink-0 place-items-center rounded-[0.875rem] bg-[color-mix(in_oklab,var(--story)_10%,white)] text-(--story) transition-colors hover:bg-[color-mix(in_oklab,var(--story)_18%,white)]"
                            >
                                <X
                                    aria-hidden="true"
                                    className="size-[1.125rem]"
                                />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}

            {freeLeft.length > 0 ? (
                <div className="grid grid-cols-2 gap-2.5">
                    <div className="grid content-start gap-2.5">
                        <p className="text-xs font-extrabold tracking-[0.08em] text-white/85 uppercase">
                            Pojam
                        </p>
                        {freeLeft.map((left) => {
                            const selected =
                                pending?.side === 'left' &&
                                pending.id === left.id;
                            return (
                                <Toggle
                                    key={left.id}
                                    pressed={selected}
                                    onPressedChange={() =>
                                        pick('left', left.id)
                                    }
                                    className={cx(
                                        chip,
                                        selected
                                            ? 'bg-highlight text-ink shadow-[0_0_0_3px_#fff]'
                                            : 'bg-white text-ink',
                                    )}
                                >
                                    {left.text}
                                </Toggle>
                            );
                        })}
                    </div>
                    <div className="grid content-start gap-2.5">
                        <p className="text-xs font-extrabold tracking-[0.08em] text-white/85 uppercase">
                            Odgovor
                        </p>
                        {freeRight.map((right) => {
                            const selected =
                                pending?.side === 'right' &&
                                pending.id === right.id;
                            return (
                                <Toggle
                                    key={right.id}
                                    pressed={selected}
                                    onPressedChange={() =>
                                        pick('right', right.id)
                                    }
                                    className={cx(
                                        chip,
                                        selected
                                            ? 'bg-highlight text-ink shadow-[0_0_0_3px_#fff]'
                                            : 'border-2 border-dashed border-white/75 bg-white/10 font-semibold text-white hover:bg-white/16',
                                    )}
                                >
                                    {right.text}
                                </Toggle>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <p className="flex items-center gap-2 rounded-[1.125rem] bg-white/16 px-4 py-3 text-[0.9375rem] font-bold">
                    <Check aria-hidden="true" className="size-5" />
                    Svi pojmovi su povezani.
                </p>
            )}
        </div>
    );
}
