import { ArrowLeft, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import Link from 'next/link';
import type { QuizQuestionResult, QuizResult } from '@/types/quiz-public';
import { QuestionType } from '@/types/quiz-public';

const formatScore = (value: number) =>
    new Intl.NumberFormat('hr-HR', { maximumFractionDigits: 2 }).format(value);

function AnswerReview({ item }: { item: QuizQuestionResult }) {
    const { question } = item;

    if (
        question.type === QuestionType.SingleAnswer ||
        question.type === QuestionType.MultipleAnswers
    ) {
        return (
            <ul className="space-y-2">
                {question.choices.map((choice) => {
                    const selected = question.selectedChoiceIds.includes(
                        choice.id,
                    );
                    const correct = item.correctChoiceIds.includes(choice.id);
                    return (
                        <li
                            key={choice.id}
                            className={`rounded-lg border px-3 py-2 text-sm ${
                                correct
                                    ? 'border-success-line bg-success-soft text-success'
                                    : selected
                                      ? 'border-brand bg-brand-soft text-brand'
                                      : 'border-line text-ink'
                            }`}
                        >
                            {choice.text}
                            {selected && (
                                <span className="ml-2 font-semibold">
                                    Vaš odabir
                                </span>
                            )}
                            {correct && (
                                <span className="ml-2 font-semibold">
                                    Točno
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    }

    if (question.type === QuestionType.TextAnswer) {
        return (
            <div className="space-y-2 text-sm text-ink">
                <p>
                    <span className="font-semibold">Vaš odgovor:</span>{' '}
                    {question.textAnswer || 'Bez odgovora'}
                </p>
                <p>
                    <span className="font-semibold">Prihvaćeni odgovori:</span>{' '}
                    {item.acceptedTextAnswers.join(', ')}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2 text-sm text-ink">
            {question.leftOptions.map((left) => {
                const selectedId = question.selectedMatches.find(
                    (match) => match.leftOptionId === left.id,
                )?.rightOptionId;
                const correctId = item.correctMatches.find(
                    (match) => match.leftOptionId === left.id,
                )?.rightOptionId;
                const selected = question.rightOptions.find(
                    (option) => option.id === selectedId,
                )?.text;
                const correct = question.rightOptions.find(
                    (option) => option.id === correctId,
                )?.text;
                return (
                    <p key={left.id} className="rounded-lg bg-muted px-3 py-2">
                        <span className="font-semibold">{left.text}</span> →{' '}
                        {selected ?? 'Bez odgovora'}
                        {selectedId !== correctId && (
                            <span className="ml-2 text-success">
                                Točno: {correct}
                            </span>
                        )}
                    </p>
                );
            })}
        </div>
    );
}

export function ResultView({
    result,
    onRestart,
    restartLabel = 'Novi pokušaj',
}: {
    result: QuizResult;
    onRestart: () => void;
    restartLabel?: string;
}) {
    return (
        <div className="space-y-8">
            <section className="quiz-card p-6 shadow-panel sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                    Kviz je završen
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                    {result.quizName || 'Vaš rezultat'}
                </h1>
                <div className="mt-8 flex flex-wrap items-end gap-5">
                    <p className="text-5xl font-semibold tracking-tight text-ink">
                        {formatScore(result.score)}
                        <span className="text-2xl font-normal text-subtle">
                            {' '}
                            / {formatScore(result.maximumScore)}
                        </span>
                    </p>
                    <p className="pb-1 text-lg text-subtle">
                        {formatScore(result.percentage)}%
                    </p>
                </div>
                {result.passed !== null && (
                    <p
                        className={`mt-5 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                            result.passed
                                ? 'bg-success-soft text-success'
                                : 'bg-brand-soft text-brand'
                        }`}
                    >
                        {result.passed ? 'Položeno' : 'Nije položeno'}
                    </p>
                )}
                <p className="mt-5 text-sm text-subtle">
                    Sada možete pregledati točne odgovore i objašnjenja.
                </p>
            </section>

            <section className="space-y-4" aria-label="Pregled odgovora">
                <h2 className="text-xl font-semibold text-ink">
                    Pregled odgovora
                </h2>
                {result.questions.map((item, index) => (
                    <article
                        key={item.question.id}
                        className="quiz-card p-5 sm:p-6"
                    >
                        <div className="flex items-start gap-3">
                            {item.isCorrect ? (
                                <CheckCircle2
                                    className="mt-0.5 size-6 shrink-0 text-success"
                                    aria-hidden="true"
                                />
                            ) : (
                                <XCircle
                                    className="mt-0.5 size-6 shrink-0 text-brand"
                                    aria-hidden="true"
                                />
                            )}
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <h3 className="font-semibold text-ink">
                                        {index + 1}. {item.question.text}
                                    </h3>
                                    <span className="text-sm text-subtle">
                                        Bodovi: {formatScore(item.score)} /{' '}
                                        {formatScore(
                                            item.question.maximumPoints,
                                        )}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <AnswerReview item={item} />
                                </div>
                                {item.explanation && (
                                    <p className="mt-4 border-t border-line pt-4 text-sm text-subtle">
                                        <span className="font-semibold">
                                            Objašnjenje:
                                        </span>{' '}
                                        {item.explanation}
                                    </p>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </section>

            <div className="flex flex-wrap gap-3 pb-8">
                <button
                    type="button"
                    onClick={onRestart}
                    className="inline-flex items-center gap-2 quiz-button-primary px-5 py-3 font-semibold text-on-brand transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                    <RotateCcw className="size-4" aria-hidden="true" />
                    {restartLabel}
                </button>
                <Link
                    href="/"
                    className="quiz-button-secondary inline-flex items-center gap-2 px-5 py-3"
                >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Početna stranica
                </Link>
            </div>
        </div>
    );
}
