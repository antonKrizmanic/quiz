'use client';

import type { PublicQuizQuestion, QuizAnswer } from '@/types/quiz-public';
import { QuestionType } from '@/types/quiz-public';
import { MatchTermQuestion } from './match-term-question';

interface QuestionCardProps {
    question: PublicQuizQuestion;
    answer: QuizAnswer;
    number: number;
    onChange: (answer: QuizAnswer) => void;
}

const optionClass =
    'quiz-choice flex cursor-pointer items-center gap-4 px-4 py-4';

export function QuestionCard({
    question,
    answer,
    number,
    onChange,
}: QuestionCardProps) {
    return (
        <section
            aria-labelledby={`question-${question.id}`}
            className="space-y-6"
        >
            <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                    Pitanje {number}
                </p>
                <h2
                    id={`question-${question.id}`}
                    className="text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-3xl"
                >
                    {question.text}
                </h2>
                <p className="text-sm text-subtle">
                    {question.type === QuestionType.SingleAnswer &&
                        'Odaberite jedan odgovor.'}
                    {question.type === QuestionType.MultipleAnswers &&
                        'Odaberite sve odgovore koje smatrate točnima.'}
                    {question.type === QuestionType.TextAnswer &&
                        'Upišite svoj odgovor.'}
                    {question.type === QuestionType.MatchTerms &&
                        'Svakom pojmu pridružite odgovarajući par.'}
                    {' · '}
                    Bodovi: {question.maximumPoints}
                </p>
            </div>

            {(question.type === QuestionType.SingleAnswer ||
                question.type === QuestionType.MultipleAnswers) && (
                <div className="space-y-3">
                    {question.choices.map((choice, index) => {
                        const checked = answer.choiceOptionIds.includes(
                            choice.id,
                        );
                        return (
                            <label key={choice.id} className={optionClass}>
                                <input
                                    type={
                                        question.type ===
                                        QuestionType.SingleAnswer
                                            ? 'radio'
                                            : 'checkbox'
                                    }
                                    name={`question-${question.id}`}
                                    value={choice.id}
                                    checked={checked}
                                    onChange={() => {
                                        onChange({
                                            choiceOptionIds:
                                                question.type ===
                                                QuestionType.SingleAnswer
                                                    ? [choice.id]
                                                    : checked
                                                      ? answer.choiceOptionIds.filter(
                                                            (id) =>
                                                                id !==
                                                                choice.id,
                                                        )
                                                      : [
                                                            ...answer.choiceOptionIds,
                                                            choice.id,
                                                        ],
                                            text: null,
                                            matches: [],
                                        });
                                    }}
                                    className="size-5 accent-brand"
                                />
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-subtle">
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span className="text-base text-ink">
                                    {choice.text}
                                </span>
                            </label>
                        );
                    })}
                </div>
            )}

            {question.type === QuestionType.TextAnswer && (
                <div className="space-y-2">
                    <label
                        htmlFor={`text-answer-${question.id}`}
                        className="text-sm font-medium text-ink"
                    >
                        Vaš odgovor
                    </label>
                    <textarea
                        id={`text-answer-${question.id}`}
                        value={answer.text ?? ''}
                        onChange={(event) =>
                            onChange({
                                choiceOptionIds: [],
                                text: event.target.value,
                                matches: [],
                            })
                        }
                        maxLength={1000}
                        rows={5}
                        placeholder="Upišite odgovor..."
                        className="quiz-field w-full resize-y p-4 text-ink placeholder:text-subtle"
                    />
                    <p className="text-right text-xs text-subtle">
                        {(answer.text ?? '').length} / 1000
                    </p>
                </div>
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
