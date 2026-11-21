'use client';

import { Button as BaseButton } from '@ui-sdk/react/button';
import { Progress } from '@ui-sdk/react/progress';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CircleCheck,
    Flag,
    ListChecks,
    SkipForward,
    X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type PointerEvent, useEffect, useRef, useState } from 'react';
import { useQuizApi } from '@/components/quiz/config-provider';
import { Button, PendingIcon } from '@/components/ui/button';
import {
    ConfirmDialog,
    createAlertDialogController,
} from '@/components/ui/confirm-dialog';
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
import { storyColor } from '@/lib/story';
import type {
    InProgressQuiz,
    QuizAnswer,
    QuizResult,
    QuizSession,
} from '@/types/quiz-public';
import { QuestionCard } from './question-card';
import {
    StoryNotice,
    StorySegments,
    StoryShell,
    storyButton,
    storyRoundButton,
} from './story-shell';

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
    const router = useRouter();
    const [quiz, setQuiz] = useState(initialQuiz);
    const [index, setIndex] = useState(initialIndex);
    const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
    const [answer, setAnswer] = useState<QuizAnswer>(() =>
        answerFromQuestion(initialQuiz.questions[initialIndex]),
    );
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [finishError, setFinishError] = useState<string | null>(null);
    const [finishDialog] = useState(() => createAlertDialogController());
    const [navigator] = useState(() => createSheetController());
    const storyRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const focusTarget = useRef<number | null>(null);
    const swipe = useRef<{ x: number; y: number; id: number } | null>(null);

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
    const answered = hasAnswer(question, answer);

    useEffect(() => {
        if (focusTarget.current !== index) return;
        focusTarget.current = null;
        storyRef.current?.scrollTo({ top: 0 });
        headingRef.current?.focus({ preventScroll: true });
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
        setDirection(target > index ? 'next' : 'prev');
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

    async function exit() {
        if (busy) return;
        setBusy(true);
        setError(null);
        const updated = await persist();
        if (updated) router.push('/');
        else setBusy(false);
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

    const advance = () => (last ? requestFinish() : goTo(index + 1));

    function startSwipe(event: PointerEvent<HTMLDivElement>) {
        const target = event.target as Element;
        if (
            event.pointerType !== 'touch' ||
            target.closest('textarea, input, [data-slot="drawer-content"]')
        )
            return;
        swipe.current = {
            x: event.clientX,
            y: event.clientY,
            id: event.pointerId,
        };
    }

    function endSwipe(event: PointerEvent<HTMLDivElement>) {
        const start = swipe.current;
        swipe.current = null;
        if (!start || start.id !== event.pointerId) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        void (dx < 0 ? advance() : goTo(index - 1));
    }

    return (
        <StoryShell
            color={storyColor[question.type]}
            title={quiz.quizName || 'Kviz Crvenog križa'}
            subtitle={`Pitanje ${index + 1} od ${total}`}
            watermark={String(index + 1).padStart(2, '0')}
            scrollRef={storyRef}
            onPointerDown={startSwipe}
            onPointerUp={endSwipe}
            onPointerCancel={() => {
                swipe.current = null;
            }}
            progress={
                <Progress
                    aria-label="Napredak kviza"
                    value={index + 1}
                    min={0}
                    max={total}
                    getValueLabel={() =>
                        `Pitanje ${index + 1} od ${total}, odgovoreno ${answeredCount}`
                    }
                    className="flex h-1.5 items-center gap-1"
                >
                    <StorySegments
                        segments={quiz.questions.map((item, position) => ({
                            key: item.id,
                            fill:
                                position === index
                                    ? 'solid'
                                    : answeredAt(position)
                                      ? 'soft'
                                      : 'faint',
                            tall: position === index,
                        }))}
                    />
                </Progress>
            }
            actions={
                <>
                    <Sheet controller={navigator}>
                        <SheetTrigger
                            aria-label="Pregled pitanja"
                            className={storyRoundButton}
                        >
                            <ListChecks aria-hidden="true" />
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
                                                            ? 'text-white'
                                                            : 'border-2 border-control text-muted',
                                                    )}
                                                    style={
                                                        done
                                                            ? {
                                                                  background:
                                                                      storyColor[
                                                                          item
                                                                              .type
                                                                      ],
                                                              }
                                                            : undefined
                                                    }
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
                    <BaseButton
                        aria-label="Izađi iz kviza"
                        disabled={busy}
                        focusableWhenDisabled
                        onClick={exit}
                        className={storyRoundButton}
                    >
                        <X aria-hidden="true" />
                    </BaseButton>
                </>
            }
            footer={
                <div className="flex items-center gap-2.5">
                    {index > 0 && (
                        <BaseButton
                            aria-label="Prethodno pitanje"
                            disabled={busy}
                            focusableWhenDisabled
                            onClick={() => goTo(index - 1)}
                            className="grid size-13 shrink-0 place-items-center rounded-full border-2 border-white/55 transition-colors hover:bg-white/12 [&_svg]:size-[1.375rem]"
                        >
                            <PendingIcon icon={ArrowLeft} />
                        </BaseButton>
                    )}
                    <p className="min-w-0 flex-1 text-center text-[0.8125rem] text-white/85">
                        <span className="hidden pointer-coarse:inline">
                            Povucite za{' '}
                            {last ? 'završetak' : 'sljedeće pitanje'}
                        </span>
                    </p>
                    <BaseButton
                        disabled={busy}
                        focusableWhenDisabled
                        onClick={advance}
                        className={storyButton({
                            variant: answered || last ? 'solid' : 'outline',
                        })}
                    >
                        {last ? 'Završi' : answered ? 'Dalje' : 'Preskoči'}
                        <PendingIcon
                            icon={
                                last
                                    ? CircleCheck
                                    : answered
                                      ? ArrowRight
                                      : SkipForward
                            }
                        />
                    </BaseButton>
                </div>
            }
            outside={
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
            }
        >
            <div
                key={question.id}
                className={cx(
                    'flex flex-1 flex-col motion-reduce:animate-none',
                    direction === 'next' && 'animate-story-next',
                    direction === 'prev' && 'animate-story-prev',
                )}
            >
                <QuestionCard
                    question={question}
                    answer={answer}
                    number={index + 1}
                    headingRef={headingRef}
                    onChange={(next) => {
                        setAnswer(next);
                        setError(null);
                    }}
                />
                {error && <StoryNotice className="mt-4">{error}</StoryNotice>}
            </div>
        </StoryShell>
    );
}
