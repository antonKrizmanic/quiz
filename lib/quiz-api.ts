import type {
    InProgressQuiz,
    PagedResponse,
    PublicQuestionCategory,
    PublicQuizCatalogItem,
    PublicQuizInstance,
    QuizAnswer,
    QuizResult,
    StartedQuizAttempt,
} from '@/types/quiz-public';

export class QuizApiError extends Error {
    constructor(
        public readonly status: number,
        message: string,
    ) {
        super(message);
        this.name = 'QuizApiError';
    }
}

export function createQuizApi(baseUrl: string) {
    async function request<T>(
        path: string,
        options: {
            method?: 'GET' | 'POST' | 'PUT';
            body?: unknown;
            token?: string;
        } = {},
    ): Promise<T> {
        let response: Response;
        try {
            response = await fetch(`${baseUrl}${path}`, {
                method: options.method ?? 'GET',
                headers: {
                    ...(options.body === undefined
                        ? {}
                        : { 'Content-Type': 'application/json' }),
                    ...(options.token
                        ? { 'X-Quiz-Attempt-Token': options.token }
                        : {}),
                },
                body:
                    options.body === undefined
                        ? undefined
                        : JSON.stringify(options.body),
                cache: 'no-store',
            });
        } catch {
            throw new QuizApiError(
                0,
                'Poslužitelj kviza trenutno nije dostupan.',
            );
        }

        if (!response.ok) {
            const message =
                response.status === 404
                    ? 'Kviz ili pokušaj nije pronađen.'
                    : response.status === 401
                      ? 'Pristup pokušaju više nije dostupan.'
                      : response.status === 409
                        ? 'Ovaj pokušaj više nije moguće mijenjati.'
                        : 'Zahtjev nije uspio. Pokušajte ponovno.';
            throw new QuizApiError(response.status, message);
        }

        return (
            response.status === 204 ? undefined : await response.json()
        ) as T;
    }

    return {
        getCategories: (cityAssociationId: number) =>
            request<PublicQuestionCategory[]>(
                `/associations/${cityAssociationId}/categories`,
            ),
        getCatalog: (
            cityAssociationId: number,
            categoryId: number,
            page: number,
            perPage = 6,
        ) =>
            request<PagedResponse<PublicQuizCatalogItem>>(
                `/associations/${cityAssociationId}/categories/${categoryId}/quizzes?Page=${page}&PerPage=${perPage}&IgnorePageSize=false`,
            ),
        startPersonal: (
            cityAssociationId: number,
            categoryId: number,
            personName: string,
            questionCount: number,
        ) =>
            request<StartedQuizAttempt>(
                `/associations/${cityAssociationId}/categories/${categoryId}/personal-attempts`,
                { method: 'POST', body: { personName, questionCount } },
            ),
        getInstance: (instanceId: number, publicCode: string) =>
            request<PublicQuizInstance>(
                `/instances/${instanceId}/${encodeURIComponent(publicCode)}`,
            ),
        startAttempt: (
            instanceId: number,
            publicCode: string,
            personName: string,
        ) =>
            request<StartedQuizAttempt>(
                `/instances/${instanceId}/${encodeURIComponent(publicCode)}/attempts`,
                { method: 'POST', body: { personName } },
            ),
        getAttempt: (attemptId: number, token: string) =>
            request<InProgressQuiz | QuizResult>(`/attempts/${attemptId}`, {
                token,
            }),
        saveAnswer: (
            attemptId: number,
            questionId: number,
            token: string,
            answer: QuizAnswer,
        ) =>
            request<void>(
                `/attempts/${attemptId}/questions/${questionId}/answer`,
                {
                    method: 'PUT',
                    body: answer,
                    token,
                },
            ),
        completeAttempt: (attemptId: number, token: string) =>
            request<QuizResult>(`/attempts/${attemptId}/complete`, {
                method: 'POST',
                token,
            }),
    };
}

export function isQuizResult(
    value: InProgressQuiz | QuizResult,
): value is QuizResult {
    return 'maximumScore' in value && 'percentage' in value;
}
