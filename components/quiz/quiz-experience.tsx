'use client';

import {
    ArrowLeft,
    ArrowRight,
    Check,
    ClipboardList,
    RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useState } from 'react';
import { useQuizApi } from '@/components/quiz/config-provider';
import { answerFromQuestion, hasAnswer } from '@/lib/quiz-answer';
import { isQuizResult, QuizApiError } from '@/lib/quiz-api';
import {
    clearPersonalSession,
    clearQuizSession,
    readPersonalSession,
    readQuizSession,
    saveQuizSession,
} from '@/lib/quiz-session';
import type {
    InProgressQuiz,
    PublicQuizInstance,
    QuizAnswer,
    QuizResult,
    QuizSession,
} from '@/types/quiz-public';
import { QuestionCard } from './question-card';
import { ResultView } from './result-view';

const emptyAnswer: QuizAnswer = {
    choiceOptionIds: [],
    text: null,
    matches: [],
};

type QuizExperienceProps =
    | { instanceId: number; publicCode: string; attemptId?: never }
    | { attemptId: number; instanceId?: never; publicCode?: never };

export function QuizExperience({
    instanceId,
    publicCode,
    attemptId,
}: QuizExperienceProps) {
    const router = useRouter();
    const quizApi = useQuizApi();
    const personal = attemptId !== undefined;
    const [instance, setInstance] = useState<PublicQuizInstance | null>(null);
    const [session, setSession] = useState<QuizSession | null>(null);
    const [quiz, setQuiz] = useState<InProgressQuiz | null>(null);
    const [result, setResult] = useState<QuizResult | null>(null);
    const [personName, setPersonName] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState<QuizAnswer>(emptyAnswer);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        async function load() {
            setLoading(true);
            setError(null);
            setInstance(null);
            setSession(null);
            setQuiz(null);
            setResult(null);
            try {
                const stored = personal
                    ? readPersonalSession(attemptId)
                    : readQuizSession(instanceId, publicCode);
                if (stored) {
                    try {
                        const attempt = await quizApi.getAttempt(
                            stored.attemptId,
                            stored.accessToken,
                        );
                        if (!active) return;
                        setSession(stored);
                        if (isQuizResult(attempt)) {
                            setResult(attempt);
                        } else {
                            setQuiz(attempt);
                            const firstUnanswered = attempt.questions.findIndex(
                                (question) =>
                                    !hasAnswer(
                                        question,
                                        answerFromQuestion(question),
                                    ),
                            );
                            const resumeIndex =
                                firstUnanswered >= 0
                                    ? firstUnanswered
                                    : Math.max(attempt.questions.length - 1, 0);
                            setCurrentIndex(resumeIndex);
                            setAnswer(
                                attempt.questions[resumeIndex]
                                    ? answerFromQuestion(
                                          attempt.questions[resumeIndex],
                                      )
                                    : emptyAnswer,
                            );
                        }
                        return;
                    } catch (cause) {
                        if (
                            !(cause instanceof QuizApiError) ||
                            ![401, 404].includes(cause.status)
                        ) {
                            throw cause;
                        }
                        if (personal) clearPersonalSession(attemptId);
                        else clearQuizSession(instanceId, publicCode);
                    }
                }

                if (personal) {
                    if (active)
                        setError('Pokušaj nije pronađen na ovom uređaju.');
                    return;
                }

                const metadata = await quizApi.getInstance(
                    instanceId,
                    publicCode,
                );
                if (active) setInstance(metadata);
            } catch (cause) {
                if (active) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : 'Kviz trenutno nije dostupan.',
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        void load();
        return () => {
            active = false;
        };
    }, [instanceId, publicCode, attemptId, personal, quizApi]);

    async function start(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const name = personName.trim();
        if (!name || name.length > 200 || busy || personal) return;

        setBusy(true);
        setError(null);
        try {
            const started = await quizApi.startAttempt(
                instanceId,
                publicCode,
                name,
            );
            const nextSession = {
                attemptId: started.attemptId,
                accessToken: started.accessToken,
            };
            saveQuizSession(instanceId, publicCode, nextSession);
            setSession(nextSession);
            setQuiz(started.quiz);
            setCurrentIndex(0);
            setAnswer(
                started.quiz.questions[0]
                    ? answerFromQuestion(started.quiz.questions[0])
                    : emptyAnswer,
            );
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : 'Pokretanje kviza nije uspjelo.',
            );
        } finally {
            setBusy(false);
        }
    }

    async function saveAndMove(direction: 'previous' | 'next' | 'finish') {
        const question = quiz?.questions[currentIndex];
        if (!session || !quiz || !question || busy) return;

        setBusy(true);
        setError(null);
        try {
            await quizApi.saveAnswer(
                session.attemptId,
                question.id,
                session.accessToken,
                answer,
            );
            const updatedQuiz: InProgressQuiz = {
                ...quiz,
                questions: quiz.questions.map((item, index) =>
                    index === currentIndex
                        ? {
                              ...item,
                              selectedChoiceIds: [...answer.choiceOptionIds],
                              textAnswer: answer.text,
                              selectedMatches: [...answer.matches],
                          }
                        : item,
                ),
            };
            setQuiz(updatedQuiz);

            if (direction === 'finish') {
                const completed = await quizApi.completeAttempt(
                    session.attemptId,
                    session.accessToken,
                );
                setResult(completed);
                return;
            }

            const nextIndex = currentIndex + (direction === 'next' ? 1 : -1);
            setCurrentIndex(nextIndex);
            setAnswer(answerFromQuestion(updatedQuiz.questions[nextIndex]));
        } catch (cause) {
            if (direction === 'finish') {
                try {
                    const latest = await quizApi.getAttempt(
                        session.attemptId,
                        session.accessToken,
                    );
                    if (isQuizResult(latest)) {
                        setResult(latest);
                        return;
                    }
                } catch {
                    // Keep the original save or completion error visible.
                }
            }
            setError(
                cause instanceof Error
                    ? cause.message
                    : 'Spremanje odgovora nije uspjelo.',
            );
        } finally {
            setBusy(false);
        }
    }

    function restart() {
        if (personal) {
            clearPersonalSession(attemptId);
            router.push('/');
            return;
        }
        clearQuizSession(instanceId, publicCode);
        setSession(null);
        setQuiz(null);
        setResult(null);
        setPersonName('');
        setCurrentIndex(0);
        setAnswer(emptyAnswer);
        setError(null);
        if (!instance) window.location.reload();
    }

    if (loading) {
        return (
            <div
                role="status"
                className="quiz-card p-10 text-center text-subtle shadow-panel"
            >
                Učitavanje kviza...
            </div>
        );
    }

    if (result) {
        return (
            <ResultView
                result={result}
                onRestart={restart}
                restartLabel={personal ? 'Odaberi novi kviz' : 'Novi pokušaj'}
            />
        );
    }

    if (quiz && session) {
        const question = quiz.questions[currentIndex];
        if (!question) {
            return (
                <p className="rounded-2xl bg-card p-6 text-ink">
                    Ovaj pokušaj nema dostupnih pitanja.
                </p>
            );
        }
        const last = currentIndex === quiz.questions.length - 1;
        const answered = hasAnswer(question, answer);
        const progress = Math.round(
            ((currentIndex + 1) / quiz.questions.length) * 100,
        );

        return (
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                            Rješavanje kviza
                        </p>
                        <h1 className="mt-1 text-xl font-semibold text-ink">
                            {quiz.quizName || 'Kviz Crvenog križa'}
                        </h1>
                    </div>
                    <p className="rounded-full bg-card px-4 py-2 text-sm font-semibold text-ink shadow-panel">
                        {currentIndex + 1} / {quiz.questions.length}
                    </p>
                </div>

                <div
                    role="progressbar"
                    aria-label="Napredak kviza"
                    aria-valuenow={currentIndex + 1}
                    aria-valuemin={1}
                    aria-valuemax={quiz.questions.length}
                    className="h-2 overflow-hidden rounded-full bg-muted"
                >
                    <div
                        className="h-full rounded-full bg-brand transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="quiz-card p-6 shadow-panel sm:p-10">
                    <QuestionCard
                        question={question}
                        answer={answer}
                        number={currentIndex + 1}
                        onChange={setAnswer}
                    />

                    {error && (
                        <p
                            role="alert"
                            className="mt-6 rounded-lg bg-brand-soft px-4 py-3 text-sm text-brand"
                        >
                            {error}
                        </p>
                    )}

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
                        {currentIndex > 0 ? (
                            <button
                                type="button"
                                onClick={() => void saveAndMove('previous')}
                                disabled={busy}
                                className="inline-flex items-center gap-2 quiz-button-secondary px-5 py-3 font-semibold text-ink transition-colors hover:bg-muted disabled:opacity-50"
                            >
                                <ArrowLeft
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                Prethodno
                            </button>
                        ) : (
                            <span />
                        )}
                        <button
                            type="button"
                            onClick={() =>
                                void saveAndMove(last ? 'finish' : 'next')
                            }
                            disabled={busy}
                            className="inline-flex items-center gap-2 quiz-button-primary px-5 py-3 font-semibold text-on-brand transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
                        >
                            {busy
                                ? 'Spremanje...'
                                : last
                                  ? 'Završi kviz'
                                  : answered
                                    ? 'Spremi i nastavi'
                                    : 'Preskoči i nastavi'}
                            {last ? (
                                <Check className="size-4" aria-hidden="true" />
                            ) : (
                                <ArrowRight
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            )}
                        </button>
                    </div>
                </div>
                <p className="text-center text-sm text-subtle">
                    Točni odgovori bit će prikazani nakon završetka kviza.
                </p>
            </div>
        );
    }

    if (!instance) {
        return (
            <div className="quiz-card p-8 text-center shadow-panel sm:p-10">
                <h1 className="text-2xl font-semibold text-ink">
                    {personal ? 'Pokušaj nije dostupan' : 'Kviz nije dostupan'}
                </h1>
                <p role="alert" className="mt-3 text-subtle">
                    {error || 'Provjerite poveznicu i pokušajte ponovno.'}
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 quiz-button-primary px-5 py-3 font-semibold text-on-brand hover:bg-brand-hover"
                    >
                        <RotateCcw className="size-4" aria-hidden="true" />
                        Pokušaj ponovno
                    </button>
                    <Link
                        href="/"
                        className="quiz-button-secondary px-5 py-3 font-semibold text-ink hover:bg-muted"
                    >
                        Početna
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-start-layout">
            <div className="quiz-start-intro space-y-5">
                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                    <ClipboardList className="size-7" aria-hidden="true" />
                </div>
                <p className="quiz-eyebrow">Spremni za kviz?</p>
                <h1 className="text-ink">
                    {instance.name || 'Kviz Crvenog križa'}
                </h1>
                {instance.description && (
                    <p className="text-lg leading-relaxed text-subtle">
                        {instance.description}
                    </p>
                )}
                <p className="text-sm text-subtle">
                    Broj pitanja: {instance.questionCount} · Rezultat i točni
                    odgovori nakon završetka
                </p>
            </div>

            <form
                onSubmit={(event) => void start(event)}
                className="quiz-start-form"
            >
                <h2 className="quiz-section-title text-2xl font-bold text-ink">
                    Započnite pokušaj
                </h2>
                <p className="mt-2 text-sm text-subtle">
                    Upišite ime koje će biti prikazano uz vaš rezultat.
                </p>
                <label
                    htmlFor="person-name"
                    className="mt-7 block text-sm font-semibold text-ink"
                >
                    Ime i prezime *
                </label>
                <input
                    id="person-name"
                    type="text"
                    autoComplete="name"
                    value={personName}
                    onChange={(event) => setPersonName(event.target.value)}
                    maxLength={200}
                    required
                    placeholder="Vaše ime i prezime"
                    className="mt-2 w-full quiz-field px-4 py-3 text-ink outline-none placeholder:text-subtle focus:border-brand focus:ring-2 focus:ring-brand-soft"
                />
                {error && (
                    <p
                        role="alert"
                        className="mt-4 rounded-lg bg-brand-soft px-4 py-3 text-sm text-brand"
                    >
                        {error}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={busy || !personName.trim()}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 quiz-button-primary px-5 py-3 font-semibold text-on-brand transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
                >
                    {busy ? 'Pokretanje...' : 'Započni kviz'}
                    <ArrowRight className="size-4" aria-hidden="true" />
                </button>
            </form>
        </div>
    );
}
