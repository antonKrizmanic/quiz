'use client';

import { Button as BaseButton } from '@ui-sdk/react/button';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CircleCheck,
    Flag,
    ListChecks,
    SkipForward,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useQuizApi } from '@/components/quiz/config-provider';
import { Button, buttonClass, PendingIcon } from '@/components/ui/button';
import {
    ConfirmDialog,
    createAlertDialogController,
} from '@/components/ui/confirm-dialog';
import { Notice } from '@/components/ui/notice';
import { ProgressBar } from '@/components/ui/progress';
import {
    createSheetController,
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { errorMessage } from '@/lib/categories';
import { cx } from '@/lib/cx';
import { questionsLabel } from '@/lib/format';
import { answerFromQuestion, hasAnswer, sameAnswer } from '@/lib/quiz-answer';
import { isQuizResult } from '@/lib/quiz-api';
import type {
    InProgressQuiz,
    QuizAnswer,
    QuizResult,
    QuizSession,
} from '@/types/quiz-public';
import { QuestionCard } from './question-card';

type QuizRunnerProps = {
    quiz: InProgressQuiz;
    session: QuizSession;
    initialIndex: number;
    onComplete: (result: QuizResult) => void;
};

export function QuizRunner({
    quiz: initialQuiz,
    session,
    initialIndex,
    onComplete,
}: QuizRunnerProps) {
    const quizApi = useQuizApi();
    const [quiz, setQuiz] = useState(initialQuiz);
    const [index, setIndex] = useState(initialIndex);
    const [answer, setAnswer] = useState<QuizAnswer>(() =>
        answerFromQuestion(initialQuiz.questions[initialIndex]),
    );
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [finishError, setFinishError] = useState<string | null>(null);
    const [finishDialog] = useState(() => createAlertDialogController());
    const [navigator] = useState(() => createSheetController());
    const headingRef = useRef<HTMLHeadingElement>(null);
    const focusTarget = useRef<number | null>(null);

    const question = quiz.questions[index];
    const total = quiz.questions.length;
    const last = index === total - 1;
    const answeredAt = (position: number) => {
        const item = quiz.questions[position];
        return hasAnswer(
            item,
            position === index ? answer : answerFromQuestion(item),
        );
    };
    const answeredCount = quiz.questions.filter((_, position) =>
        answeredAt(position),
    ).length;
    const unanswered = total - answeredCount;

    useEffect(() => {
        if (focusTarget.current !== index) return;
        focusTarget.current = null;
        const heading = headingRef.current;
        if (!heading) return;
        if (heading.getBoundingClientRect().top < 96)
            heading.scrollIntoView({ block: 'start' });
        heading.focus({ preventScroll: true });
    }, [index]);

    async function persist(): Promise<InProgressQuiz | null> {
        if (sameAnswer(answer, answerFromQuestion(question))) return quiz;
        try {
            await quizApi.saveAnswer(
                session.attemptId,
                question.id,
                session.accessToken,
                answer,
            );
        } catch (cause) {
            setError(errorMessage(cause, 'Spremanje odgovora nije uspjelo.'));
            return null;
        }
        const updated: InProgressQuiz = {
            ...quiz,
            questions: quiz.questions.map((item, position) =>
                position === index
                    ? {
                          ...item,
                          selectedChoiceIds: [...answer.choiceOptionIds],
                          textAnswer: answer.text,
                          selectedMatches: [...answer.matches],
                      }
                    : item,
            ),
        };
        setQuiz(updated);
        return updated;
    }

    async function goTo(target: number) {
        if (busy || target === index || target < 0 || target >= total) return;
        setBusy(true);
        setError(null);
        const updated = await persist();
        setBusy(false);
        if (!updated) return;
        focusTarget.current = target;
        setIndex(target);
        setAnswer(answerFromQuestion(updated.questions[target]));
    }

    async function requestFinish() {
        if (busy) return;
        setBusy(true);
        setError(null);
        const updated = await persist();
        setBusy(false);
        if (!updated) return;
        setFinishError(null);
        void finishDialog.open();
    }

    async function complete() {
        setFinishError(null);
        try {
            onComplete(
                await quizApi.completeAttempt(
                    session.attemptId,
                    session.accessToken,
                ),
            );
        } catch (cause) {
            try {
                const latest = await quizApi.getAttempt(
                    session.attemptId,
                    session.accessToken,
                );
                if (isQuizResult(latest)) {
                    onComplete(latest);
                    return;
                }
            } catch {
                // Keep the original completion error visible.
            }
            setFinishError(
                errorMessage(cause, 'Završavanje kviza nije uspjelo.'),
            );
            throw cause;
        }
    }

    const answered = hasAnswer(question, answer);

    return (
        <div className="mx-auto grid max-w-2xl">
            <div className="sticky top-0 z-20 -mx-4 -mt-4 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur-md sm:top-3 sm:mx-0 sm:mt-0 sm:rounded-2xl sm:border sm:bg-surface/90 sm:shadow-card">
                <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">
                            {quiz.quizName || 'Kviz Crvenog križa'}
                        </p>
                        <p className="text-xs text-muted tabular-nums">
                            Pitanje {index + 1} od {total}
                        </p>
                    </div>
                    <Sheet controller={navigator}>
                        <SheetTrigger
                            className={buttonClass({
                                variant: 'secondary',
                                size: 'sm',
                            })}
                        >
                            <ListChecks aria-hidden="true" />
                            Pregled
                        </SheetTrigger>
                        <SheetContent
                            title="Pregled pitanja"
                            description={`Odgovoreno ${answeredCount} od ${total}. Odaberite pitanje za povratak na njega.`}
                            finalFocus={() => headingRef.current}
                            footer={
                                <Button
                                    size="lg"
                                    block
                                    disabled={busy}
                                    focusableWhenDisabled
                                    onClick={() => {
                                        navigator.close();
                                        return requestFinish();
                                    }}
                                >
                                    <Flag aria-hidden="true" />
                                    Završi kviz
                                </Button>
                            }
                        >
                            <ol className="grid gap-1">
                                {quiz.questions.map((item, position) => {
                                    const done = answeredAt(position);
                                    const current = position === index;
                                    return (
                                        <li key={item.id}>
                                            <BaseButton
                                                aria-current={
                                                    current ? 'step' : undefined
                                                }
                                                disabled={busy}
                                                onClick={() => {
                                                    navigator.close();
                                                    return goTo(position);
                                                }}
                                                className={cx(
                                                    'flex min-h-14 w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition-colors hover:bg-sunken data-disabled:opacity-60',
                                                    current &&
                                                        'bg-primary-soft hover:bg-primary-soft',
                                                )}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={cx(
                                                        'grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold tabular-nums',
                                                        done
                                                            ? 'bg-primary text-on-primary'
                                                            : 'border-2 border-control text-muted',
                                                    )}
                                                >
                                                    {done ? (
                                                        <Check
                                                            strokeWidth={3}
                                                            className="size-4"
                                                        />
                                                    ) : (
                                                        position + 1
                                                    )}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="sr-only">
                                                        Pitanje {position + 1}:{' '}
                                                    </span>
                                                    <span className="line-clamp-2 text-sm leading-snug text-fg">
                                                        {item.text}
                                                    </span>
                                                    <span className="sr-only">
                                                        {done
                                                            ? ', odgovoreno'
                                                            : ', bez odgovora'}
                                                    </span>
                                                </span>
                                            </BaseButton>
                                        </li>
                                    );
                                })}
                            </ol>
                        </SheetContent>
                    </Sheet>
                </div>
                <ProgressBar
                    className="mt-3"
                    value={index + 1}
                    max={total}
                    label="Napredak kviza"
                    valueLabel={`Pitanje ${index + 1} od ${total}`}
                />
            </div>

            <div className="pt-6 sm:pt-8">
                <QuestionCard
                    key={question.id}
                    question={question}
                    answer={answer}
                    number={index + 1}
                    headingRef={headingRef}
                    onChange={(next) => {
                        setAnswer(next);
                        setError(null);
                    }}
                />
            </div>

            {error && (
                <Notice tone="danger" className="mt-5">
                    {error}
                </Notice>
            )}

            <p className="mt-6 text-center text-sm text-muted">
                Točni odgovori bit će prikazani nakon završetka kviza.
            </p>

            <div className="sticky bottom-0 z-20 -mx-4 mt-4 border-t border-line bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-float backdrop-blur-md sm:bottom-3 sm:mx-0 sm:rounded-2xl sm:border sm:px-3 sm:pb-3">
                <div className="flex items-center gap-2">
                    {index > 0 && (
                        <Button
                            variant="secondary"
                            size="lg"
                            aria-label="Prethodno pitanje"
                            className="w-13 shrink-0 px-0 sm:w-auto sm:px-5"
                            disabled={busy}
                            focusableWhenDisabled
                            onClick={() => goTo(index - 1)}
                        >
                            <PendingIcon icon={ArrowLeft} />
                            <span className="hidden sm:inline">Prethodno</span>
                        </Button>
                    )}
                    {last ? (
                        <Button
                            size="lg"
                            className="flex-1"
                            disabled={busy}
                            focusableWhenDisabled
                            onClick={requestFinish}
                        >
                            <PendingIcon icon={CircleCheck} />
                            Završi kviz
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            variant={answered ? 'primary' : 'secondary'}
                            className="flex-1"
                            disabled={busy}
                            focusableWhenDisabled
                            onClick={() => goTo(index + 1)}
                        >
                            {answered ? 'Sljedeće pitanje' : 'Preskoči pitanje'}
                            <PendingIcon
                                icon={answered ? ArrowRight : SkipForward}
                            />
                        </Button>
                    )}
                </div>
            </div>

            <ConfirmDialog
                controller={finishDialog}
                title="Završiti kviz?"
                description={
                    unanswered > 0
                        ? `Bez odgovora: ${questionsLabel(unanswered)}. Nakon završetka odgovore više nije moguće mijenjati.`
                        : 'Odgovorili ste na sva pitanja. Nakon završetka odgovore više nije moguće mijenjati.'
                }
                cancelLabel="Nastavi rješavati"
                confirmLabel="Završi kviz"
                confirmIcon={Flag}
                pendingAnnouncement="Završavanje kviza"
                error={finishError}
                onConfirm={complete}
            />
        </div>
    );
}
