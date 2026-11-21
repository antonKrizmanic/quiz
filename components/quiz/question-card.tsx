'use client';

import {
    Checkbox,
    CheckboxGroup,
    CheckboxIndicator,
} from '@ui-sdk/react/checkbox';
import { Field, FieldDescription, FieldLabel } from '@ui-sdk/react/field';
import { Radio, RadioGroup } from '@ui-sdk/react/radio';
import { Textarea } from '@ui-sdk/react/textarea';
import { Check } from 'lucide-react';
import type { Ref } from 'react';
import { cx } from '@/lib/cx';
import { pointsLabel } from '@/lib/format';
import { storyLabel } from '@/lib/story';
import type {
    PublicQuizQuestion,
    QuizAnswer,
    QuizOption,
} from '@/types/quiz-public';
import { QuestionType } from '@/types/quiz-public';
import { MatchTermQuestion } from './match-term-question';

type QuestionCardProps = {
    question: PublicQuizQuestion;
    answer: QuizAnswer;
    number: number;
    headingRef?: Ref<HTMLHeadingElement>;
    onChange: (answer: QuizAnswer) => void;
};

const instructions: Record<QuestionType, string> = {
    [QuestionType.SingleAnswer]: 'Odaberite jedan odgovor.',
    [QuestionType.MultipleAnswers]: 'Odaberite sve točne odgovore.',
    [QuestionType.TextAnswer]: 'Upišite svoj odgovor.',
    [QuestionType.MatchTerms]: 'Dodirnite pojam, zatim njegov par.',
};

const pill =
    'group flex min-h-15 w-full items-center gap-3.5 rounded-[1.25rem] bg-white py-2.5 pr-4 pl-2.5 text-left text-lg font-bold text-ink transition-[background-color,color,box-shadow,scale] duration-150 active:scale-[0.98] data-checked:bg-ink data-checked:text-white data-checked:shadow-[0_0_0_3px_#fff] motion-reduce:transition-none';

const headingSize = (text: string) =>
    text.length > 140
        ? 'text-2xl'
        : text.length > 80
          ? 'text-[1.75rem]'
          : 'text-[2.125rem]';

export function QuestionCard({
    question,
    answer,
    number,
    headingRef,
    onChange,
}: QuestionCardProps) {
    const headingId = `question-${question.id}`;

    return (
        <section
            aria-labelledby={headingId}
            className="flex flex-1 flex-col gap-6"
        >
            <header className="flex flex-1 flex-col justify-center gap-3.5 py-4">
                <p className="self-start rounded-full bg-white/16 px-3 py-1.5 text-[0.8125rem] font-bold tracking-wide">
                    {storyLabel[question.type]} ·{' '}
                    {pointsLabel(question.maximumPoints)}
                </p>
                <h1
                    ref={headingRef}
                    id={headingId}
                    tabIndex={-1}
                    className={cx(
                        'leading-[1.06] font-extrabold tracking-tight text-balance outline-none',
                        headingSize(question.text),
                    )}
                >
                    <span className="sr-only">Pitanje {number}: </span>
                    {question.text}
                </h1>
                <p className="text-[0.9375rem] text-white/85">
                    {instructions[question.type]}
                </p>
            </header>

            {question.type === QuestionType.SingleAnswer && (
                <RadioGroup
                    aria-labelledby={headingId}
                    value={answer.choiceOptionIds[0] ?? null}
                    onValueChange={(value) =>
                        onChange({
                            choiceOptionIds: value ? [value] : [],
                            text: null,
                            matches: [],
                        })
                    }
                    className="grid gap-2.5"
                >
                    {question.choices.map((choice, index) => (
                        <Radio
                            key={choice.id}
                            value={choice.id}
                            className={pill}
                        >
                            <ChoiceContent choice={choice} index={index} />
                            <Check
                                aria-hidden="true"
                                strokeWidth={2.8}
                                className="hidden size-6 shrink-0 group-data-checked:block"
                            />
                        </Radio>
                    ))}
                </RadioGroup>
            )}

            {question.type === QuestionType.MultipleAnswers && (
                <CheckboxGroup
                    aria-labelledby={headingId}
                    value={answer.choiceOptionIds}
                    onValueChange={(value) =>
                        onChange({
                            choiceOptionIds: [...value],
                            text: null,
                            matches: [],
                        })
                    }
                    className="grid gap-2.5"
                >
                    {question.choices.map((choice, index) => (
                        <Checkbox
                            key={choice.id}
                            value={choice.id}
                            className={pill}
                        >
                            <ChoiceContent choice={choice} index={index} />
                            <span
                                aria-hidden="true"
                                className="grid size-7 shrink-0 place-items-center rounded-lg border-2 border-ink/25 group-data-checked:border-white group-data-checked:bg-white group-data-checked:text-ink"
                            >
                                <CheckboxIndicator>
                                    <Check
                                        strokeWidth={3.2}
                                        className="size-4"
                                    />
                                </CheckboxIndicator>
                            </span>
                        </Checkbox>
                    ))}
                </CheckboxGroup>
            )}

            {question.type === QuestionType.TextAnswer && (
                <Field className="grid gap-2">
                    <FieldLabel className="text-sm font-bold text-white/90">
                        Vaš odgovor
                    </FieldLabel>
                    <Textarea
                        autoResize
                        rows={3}
                        maxLength={1000}
                        placeholder="Upišite odgovor…"
                        value={answer.text ?? ''}
                        onValueChange={(value) =>
                            onChange({
                                choiceOptionIds: [],
                                text: value,
                                matches: [],
                            })
                        }
                        className="max-h-72 min-h-32 w-full resize-none rounded-[1.25rem] border-0 bg-white px-4 py-3.5 text-lg leading-relaxed text-ink placeholder:text-ink/55 focus-visible:outline-offset-2"
                    />
                    <FieldDescription className="text-right text-sm text-white/85 tabular-nums">
                        {(answer.text ?? '').length} / 1000 znakova
                    </FieldDescription>
                </Field>
            )}

            {question.type === QuestionType.MatchTerms && (
                <MatchTermQuestion
                    key={question.id}
                    question={question}
                    answer={answer}
                    onChange={onChange}
                />
            )}
        </section>
    );
}

function ChoiceContent({
    choice,
    index,
}: {
    choice: QuizOption;
    index: number;
}) {
    return (
        <>
            <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-[0.875rem] bg-[color-mix(in_oklab,var(--story)_12%,white)] text-base text-(--story) transition-colors group-data-checked:bg-white group-data-checked:text-ink"
            >
                {String.fromCharCode(65 + index)}
            </span>
            <span className="min-w-0 flex-1 leading-snug">{choice.text}</span>
        </>
    );
}
