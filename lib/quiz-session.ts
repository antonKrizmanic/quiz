import type { QuizSession } from '@/types/quiz-public';

const key = (instanceId: number, publicCode: string) =>
    `quiz-attempt:${instanceId}:${publicCode}`;

export function readQuizSession(
    instanceId: number,
    publicCode: string,
): QuizSession | null {
    try {
        const raw = localStorage.getItem(key(instanceId, publicCode));
        if (!raw) return null;
        const value: unknown = JSON.parse(raw);
        if (
            typeof value === 'object' &&
            value !== null &&
            'attemptId' in value &&
            'accessToken' in value &&
            typeof value.attemptId === 'number' &&
            Number.isInteger(value.attemptId) &&
            value.attemptId > 0 &&
            typeof value.accessToken === 'string' &&
            value.accessToken.length > 0
        ) {
            return {
                attemptId: value.attemptId,
                accessToken: value.accessToken,
            };
        }
    } catch {
        // Storage can be disabled. The current attempt still works in memory.
    }
    return null;
}

export function saveQuizSession(
    instanceId: number,
    publicCode: string,
    session: QuizSession,
) {
    try {
        localStorage.setItem(
            key(instanceId, publicCode),
            JSON.stringify(session),
        );
    } catch {
        // Storage can be disabled. The current attempt still works in memory.
    }
}

export function clearQuizSession(instanceId: number, publicCode: string) {
    try {
        localStorage.removeItem(key(instanceId, publicCode));
    } catch {
        // Nothing to clear when storage is disabled.
    }
}

const personalKey = (attemptId: number) => `quiz-personal-attempt:${attemptId}`;
const personalMemory = new Map<number, QuizSession>();

export function readPersonalSession(attemptId: number): QuizSession | null {
    try {
        const raw = localStorage.getItem(personalKey(attemptId));
        if (!raw) return personalMemory.get(attemptId) ?? null;
        const value: unknown = JSON.parse(raw);
        if (
            typeof value === 'object' &&
            value !== null &&
            'attemptId' in value &&
            'accessToken' in value &&
            value.attemptId === attemptId &&
            typeof value.accessToken === 'string' &&
            value.accessToken.length > 0
        ) {
            return { attemptId, accessToken: value.accessToken };
        }
    } catch {
        // Storage can be disabled.
    }
    return personalMemory.get(attemptId) ?? null;
}

export function savePersonalSession(session: QuizSession) {
    personalMemory.set(session.attemptId, session);
    try {
        localStorage.setItem(
            personalKey(session.attemptId),
            JSON.stringify(session),
        );
    } catch {
        // The current attempt works in memory when storage is disabled.
    }
}

export function clearPersonalSession(attemptId: number) {
    personalMemory.delete(attemptId);
    try {
        localStorage.removeItem(personalKey(attemptId));
    } catch {
        // Nothing to clear when storage is disabled.
    }
}
