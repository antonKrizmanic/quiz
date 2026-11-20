'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuizApi } from '@/components/quiz/config-provider';
import { errorMessage } from '@/lib/categories';
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
    QuizResult,
    QuizSession,
} from '@/types/quiz-public';
import { QuizRunner } from './quiz-runner';
import { QuizStart } from './quiz-start';
import { QuizLoading, QuizUnavailable } from './quiz-status';
import { ResultView } from './result-view';

type QuizExperienceProps =
    | { instanceId: number; publicCode: string; attemptId?: never }
    | { attemptId: number; instanceId?: never; publicCode?: never };

type Attempt = {
    session: QuizSession;
    quiz: InProgressQuiz;
    startIndex: number;
};

function resumeIndex(quiz: InProgressQuiz) {
    const firstUnanswered = quiz.questions.findIndex(
        (question) => !hasAnswer(question, answerFromQuestion(question)),
    );
    return firstUnanswered >= 0
        ? firstUnanswered
        : Math.max(quiz.questions.length - 1, 0);
}

export function QuizExperience({
    instanceId,
    publicCode,
    attemptId,
}: QuizExperienceProps) {
    const router = useRouter();
    const quizApi = useQuizApi();
    const personal = attemptId !== undefined;
    const [instance, setInstance] = useState<PublicQuizInstance | null>(null);
    const [attempt, setAttempt] = useState<Attempt | null>(null);
    const [result, setResult] = useState<QuizResult | null>(null);
    const [justCompleted, setJustCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startError, setStartError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        async function load() {
            setLoading(true);
            setError(null);
            setInstance(null);
            setAttempt(null);
            setResult(null);
            try {
                const stored = personal
                    ? readPersonalSession(attemptId)
                    : readQuizSession(instanceId, publicCode);
                if (stored) {
                    try {
                        const loaded = await quizApi.getAttempt(
                            stored.attemptId,
                            stored.accessToken,
                        );
                        if (!active) return;
                        if (isQuizResult(loaded)) setResult(loaded);
                        else
                            setAttempt({
                                session: stored,
                                quiz: loaded,
                                startIndex: resumeIndex(loaded),
                            });
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
                if (active)
                    setError(
                        errorMessage(cause, 'Kviz trenutno nije dostupan.'),
                    );
            } finally {
                if (active) setLoading(false);
            }
        }

        void load();
        return () => {
            active = false;
        };
    }, [instanceId, publicCode, attemptId, personal, quizApi]);

    async function start(personName: string) {
        if (personal) return;
        setStartError(null);
        try {
            const started = await quizApi.startAttempt(
                instanceId,
                publicCode,
                personName,
            );
            const session = {
                attemptId: started.attemptId,
                accessToken: started.accessToken,
            };
            saveQuizSession(instanceId, publicCode, session);
            setAttempt({ session, quiz: started.quiz, startIndex: 0 });
            window.scrollTo({ top: 0, behavior: 'instant' });
        } catch (cause) {
            setStartError(
                errorMessage(cause, 'Pokretanje kviza nije uspjelo.'),
            );
        }
    }

    function restart() {
        if (personal) {
            clearPersonalSession(attemptId);
            router.push('/');
            return;
        }
        clearQuizSession(instanceId, publicCode);
        setAttempt(null);
        setResult(null);
        setJustCompleted(false);
        setStartError(null);
        if (!instance) window.location.reload();
        else window.scrollTo({ top: 0, behavior: 'instant' });
    }

    if (loading) return <QuizLoading />;

    if (result) {
        return (
            <ResultView
                result={result}
                announce={justCompleted}
                onRestart={restart}
                restartLabel={personal ? 'Odaberi novi kviz' : 'Novi pokušaj'}
            />
        );
    }

    if (attempt) {
        if (attempt.quiz.questions.length === 0) {
            return (
                <QuizUnavailable
                    personal={personal}
                    message="Ovaj pokušaj nema dostupnih pitanja."
                />
            );
        }
        return (
            <QuizRunner
                key={attempt.session.attemptId}
                quiz={attempt.quiz}
                session={attempt.session}
                initialIndex={attempt.startIndex}
                onComplete={(completed) => {
                    setJustCompleted(true);
                    setResult(completed);
                }}
            />
        );
    }

    if (!instance) {
        return <QuizUnavailable personal={personal} message={error} />;
    }

    return <QuizStart instance={instance} error={startError} onStart={start} />;
}
