import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

import * as HttpService from '../../services/HttpService';
import {
    getMatchTermQuestionAnswers,
    getQuizDetail,
    initializeQuiz,
    submitQuizTake
} from '../QuizRepository';
import {
    QuizAnswerOption,
    QuizAnswersState,
    QuizQuestionDetail,
    QuizTakeAnswerDto
} from '../../types/quiz';

afterEach(() => {
    mock.restoreAll();
});

describe('QuizRepository', () => {
    it('maps quiz detail responses into typed questions', async () => {
        const getMock = mock.method(HttpService, 'get');
        getMock.mock.mockImplementationOnce(async () => ({
            data: {
                questions: [
                    {
                        id: 1,
                        text: 'Root question',
                        questionType: 1,
                        parentId: null,
                        answers: [
                            { id: 11, text: 'Answer', questionId: 1 }
                        ],
                        children: [
                            {
                                id: 2,
                                text: 'Child question',
                                questionType: 4,
                                parentId: 1,
                                answers: [
                                    { id: 21, text: 'Child answer', questionId: 2 }
                                ],
                                children: []
                            }
                        ]
                    }
                ]
            }
        }) as any);

        const result = await getQuizDetail(7);

        assert.equal(getMock.mock.callCount(), 1);
        assert.deepEqual(result.questions[0].answers[0], { id: 11, text: 'Answer', questionId: 1 } satisfies QuizAnswerOption);
        assert.equal(result.questions[0].children[0].id, 2);
    });

    it('submits quiz take payload with mapped answers', async () => {
        const postMock = mock.method(HttpService, 'post');
        postMock.mock.mockImplementation(async (_url, body) => ({ data: 55, body } as any));

        const questions: QuizQuestionDetail[] = [
            {
                id: 1,
                text: 'Single choice',
                questionType: 1,
                parentId: null,
                answers: [],
                children: []
            },
            {
                id: 2,
                text: 'Multiple choice',
                questionType: 2,
                parentId: null,
                answers: [],
                children: []
            },
            {
                id: 3,
                text: 'Match',
                questionType: 4,
                parentId: null,
                answers: [],
                children: []
            }
        ];

        const answers: QuizAnswersState = {
            1: { id: 101, text: 'Single', questionId: 1 },
            2: [
                { id: 201, text: 'Multi A', questionId: 2 },
                { id: 202, text: 'Multi B', questionId: 2 }
            ],
            3: [
                { questionId: 31, answerId: 301, parentId: 3, text: 'Match A' } as QuizTakeAnswerDto
            ]
        };

        const submissionId = await submitQuizTake({
            quizId: 99,
            questions,
            answers,
            startedAt: new Date('2024-01-01T00:00:00Z'),
            endedAt: new Date('2024-01-01T00:05:00Z'),
            takeUserName: 'John Doe',
            takeUserType: 4,
            cityAssociationId: 12
        });

        assert.equal(submissionId, 55);
        const firstCall = postMock.mock.calls[0];
        const [url, payload] = firstCall.arguments as [string, any];
        assert.equal(url, 'quizzes/PublicQuizTake');
        assert.deepEqual(payload.questions, [
            {
                id: 0,
                questionId: 1,
                index: 0,
                parentId: undefined,
                answers: [
                    {
                        questionId: 1,
                        answerId: 101,
                        text: 'Single',
                        parentQuestionId: undefined
                    }
                ]
            },
            {
                id: 0,
                questionId: 2,
                index: 1,
                parentId: undefined,
                answers: [
                    {
                        questionId: 2,
                        answerId: 201,
                        text: 'Multi A',
                        parentQuestionId: undefined
                    },
                    {
                        questionId: 2,
                        answerId: 202,
                        text: 'Multi B',
                        parentQuestionId: undefined
                    }
                ]
            },
            {
                id: 0,
                questionId: 3,
                index: 2,
                parentId: undefined,
                answers: [
                    {
                        questionId: 31,
                        answerId: 301,
                        parentId: 3,
                        text: 'Match A'
                    }
                ]
            }
        ]);
    });

    it('fetches match term answers for child questions', async () => {
        const getMock = mock.method(HttpService, 'get');
        let callIndex = 0;
        getMock.mock.mockImplementation(async () => {
            if (callIndex === 0) {
                callIndex++;
                return { data: { list: [{ id: 10, text: 'Child A' }, { id: 11, text: 'Child B' }] } } as any;
            }
            if (callIndex === 1) {
                callIndex++;
                return { data: { list: [
                    { id: 100, text: 'Answer A', questionId: 10, isCorrect: false },
                    { id: 101, text: 'Answer B', questionId: 10, isCorrect: true }
                ] } } as any;
            }
            if (callIndex === 2) {
                callIndex++;
                return { data: { list: [
                    { id: 200, text: 'Answer C', questionId: 11, isCorrect: true }
                ] } } as any;
            }
            throw new Error('Unexpected get call');
        });

        const result = await getMatchTermQuestionAnswers(5, 99);

        assert.equal(result.items.length, 2);
        assert.equal(result.items[0].correctAnswer?.id, 101);
        assert.equal(result.items[1].answers[0].isCorrect, true);
        assert.equal(getMock.mock.callCount(), 3);
    });

    it('initializes quiz with expected payload', async () => {
        const postMock = mock.method(HttpService, 'post');
        postMock.mock.mockImplementation(async () => ({ data: 777 } as any));

        const result = await initializeQuiz({
            quizCategoryId: 3,
            quizTheme: 4,
            cityAssociationId: 15
        });

        assert.equal(result, 777);
        const initCall = postMock.mock.calls[0];
        const [initUrl, initPayload] = initCall.arguments as [string, any];
        assert.equal(initUrl, 'quizzes/PublicQuiz');
        assert.deepEqual(initPayload, {
            QuizCategoryId: 3,
            QuizTheme: 4,
            CityAssociationId: 15
        });
    });
});
