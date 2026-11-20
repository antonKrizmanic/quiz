'use client';

import {
    Checkbox,
    CheckboxGroup,
    CheckboxIndicator,
} from '@ui-sdk/react/checkbox';
import { Radio, RadioGroup, RadioIndicator } from '@ui-sdk/react/radio';
import { Check } from 'lucide-react';
import type { Ref } from 'react';
import {
    Field,
    FieldDescription,
    FieldLabel,
    TextArea,
} from '@/components/ui/field';
import { pointsLabel } from '@/lib/format';
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
    [QuestionType.MatchTerms]: 'Svakom pojmu pridružite odgovarajući par.',
};

const choiceCard =
    'group flex min-h-15 cursor-pointer items-center gap-3 rounded-2xl border border-line bg-surface p-3 pr-4 transition-[border-color,background-color,scale] duration-150 hover:border-control active:scale-[0.99] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary has-data-checked:border-primary has-data-checked:bg-primary-soft motion-reduce:transition-none';

const letterBadge =
    'grid size-9 shrink-0 place-items-center rounded-xl bg-sunken text-sm font-bold text-muted transition-colors group-has-data-checked:bg-primary group-has-data-checked:text-on-primary';

export function QuestionCard({
    question,
    answer,
    number,
    headingRef,
    onChange,
}: QuestionCardProps) {
    const headingId = `question-${question.id}`;

    return (
        <section aria-labelledby={headingId} className="grid gap-5">
            <header className="grid gap-2">
                <p className="text-sm">
                    <span className="font-bold text-primary">
                        Pitanje {number}
                    </span>
                    <span className="text-muted">
                        {' '}
                        · {pointsLabel(question.maximumPoints)}
                    </span>
                </p>
                <h2
                    ref={headingRef}
                    id={headingId}
                    tabIndex={-1}
                    className="scroll-mt-32 text-[1.375rem]/snug font-bold tracking-tight text-pretty outline-none sm:text-2xl"
                >
                    {question.text}
                </h2>
                <p className="text-sm text-muted">
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
                        <label key={choice.id} className={choiceCard}>
                            <ChoiceText choice={choice} index={index} />
                            <Radio
                                value={choice.id}
                                className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-control bg-surface transition-colors focus-visible:outline-none data-checked:border-primary"
                            >
                                <RadioIndicator className="size-3 rounded-full bg-primary" />
                            </Radio>
                        </label>
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
                        <label key={choice.id} className={choiceCard}>
                            <ChoiceText choice={choice} index={index} />
                            <Checkbox
                                value={choice.id}
                                className="grid size-6 shrink-0 place-items-center rounded-lg border-2 border-control bg-surface text-on-primary transition-colors focus-visible:outline-none data-checked:border-primary data-checked:bg-primary"
                            >
                                <CheckboxIndicator>
                                    <Check
                                        aria-hidden="true"
                                        strokeWidth={3.5}
                                        className="size-3.5"
                                    />
                                </CheckboxIndicator>
                            </Checkbox>
                        </label>
                    ))}
                </CheckboxGroup>
            )}

            {question.type === QuestionType.TextAnswer && (
                <Field>
                    <FieldLabel>Vaš odgovor</FieldLabel>
                    <TextArea
                        autoResize
                        rows={4}
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
                    />
                    <FieldDescription className="text-right tabular-nums">
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

function ChoiceText({ choice, index }: { choice: QuizOption; index: number }) {
    return (
        <>
            <span aria-hidden="true" className={letterBadge}>
                {String.fromCharCode(65 + index)}
            </span>
            <span className="min-w-0 flex-1 text-base/snug text-fg">
                {choice.text}
            </span>
        </>
    );
}
