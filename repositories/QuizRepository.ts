import { Answer as MatchAnswer, Question as MatchQuestion } from '@/component-models/types';
import { get, post } from '@/services/HttpService';

export interface QuizAnswerOption {
    id: number;
    text: string;
    questionId: number;
}

export interface QuizQuestionDetail {
    id: number;
    text: string;
    questionType: number;
    parentId: number | null;
    children: QuizQuestionDetail[];
    answers: QuizAnswerOption[];
}

export interface QuizDetail {
    questions: QuizQuestionDetail[];
}

export interface MatchAnswerSubmission {
    questionId: number;
    answerId: number;
    parentId?: number | null;
    parentQuestionId?: number | null;
    text: string;
}

export type QuizAnswerSelection = QuizAnswerOption | QuizAnswerOption[] | MatchAnswerSubmission[];

export type QuizAnswersState = Record<number, QuizAnswerSelection>;

export interface SubmitQuizTakeParams {
    quizId: number;
    questions: QuizQuestionDetail[];
    answers: QuizAnswersState;
    startedAt?: Date;
    endedAt: Date;
    takeUserName: string;
    takeUserType: number;
    cityAssociationId: number;
}

export interface MatchTermQuestionAnswers {
    question: MatchQuestion;
    correctAnswer: MatchAnswer | null;
    answers: MatchAnswer[];
}

export interface MatchTermAnswersResult {
    items: MatchTermQuestionAnswers[];
}

function mapQuizAnswerOption(dto: any): QuizAnswerOption {
    return {
        id: dto.id,
        text: dto.text,
        questionId: dto.questionId
    };
}

function mapQuizQuestionDetail(dto: any): QuizQuestionDetail {
    return {
        id: dto.id,
        text: dto.text,
        questionType: dto.questionType,
        parentId: dto.parentId ?? null,
        children: (dto.children ?? []).map((child: any) => mapQuizQuestionDetail(child)),
        answers: (dto.answers ?? []).map((answer: any) => mapQuizAnswerOption(answer))
    };
}

function mapMatchQuestion(dto: any): MatchQuestion {
    return {
        id: dto.id,
        text: dto.text
    };
}

function mapMatchAnswer(dto: any): MatchAnswer {
    return {
        id: dto.id,
        text: dto.text,
        questionId: dto.questionId,
        isCorrect: Boolean(dto.isCorrect)
    };
}

function mapQuizDetail(dto: any): QuizDetail {
    return {
        questions: (dto.questions ?? []).map((question: any) => mapQuizQuestionDetail(question))
    };
}

export async function initializeQuiz(payload: { quizCategoryId: number | null; quizTheme: number | null; cityAssociationId: number; }): Promise<number> {
    const requestBody = {
        QuizCategoryId: payload.quizCategoryId,
        QuizTheme: payload.quizTheme,
        CityAssociationId: payload.cityAssociationId
    };

    const response = await post('quizzes/PublicQuiz', requestBody);
    return response.data;
}

export async function getQuizDetail(quizId: number): Promise<QuizDetail> {
    const response = await get(`quizzes/PublicQuiz/GetDetail/${quizId}`);
    return mapQuizDetail(response.data);
}

export async function submitQuizTake(params: SubmitQuizTakeParams): Promise<number> {
    const questionDtos = params.questions.map((question, index) => {
        const storedAnswer = params.answers[question.id];
        let mappedAnswers: MatchAnswerSubmission[] = [];

        if (question.questionType === 4) {
            mappedAnswers = Array.isArray(storedAnswer) ? storedAnswer as MatchAnswerSubmission[] : [];
        } else if (Array.isArray(storedAnswer)) {
            mappedAnswers = (storedAnswer as QuizAnswerOption[]).map((answer) => ({
                questionId: question.id,
                answerId: answer.id,
                text: answer.text,
                parentQuestionId: question.parentId ?? undefined
            }));
        } else if (storedAnswer) {
            const answer = storedAnswer as QuizAnswerOption;
            mappedAnswers = [{
                questionId: question.id,
                answerId: answer.id,
                text: answer.text,
                parentQuestionId: question.parentId ?? undefined
            }];
        }

        return {
            id: 0,
            questionId: question.id,
            index,
            parentId: question.parentId ?? undefined,
            answers: mappedAnswers
        };
    });

    const requestBody = {
        quizId: params.quizId,
        startedAt: params.startedAt ?? null,
        endedAt: params.endedAt,
        takeUserName: params.takeUserName,
        takeUserType: params.takeUserType,
        questions: questionDtos,
        cityAssociationId: params.cityAssociationId
    };

    const response = await post('quizzes/PublicQuizTake', requestBody);
    return response.data;
}

export async function getMatchTermQuestionAnswers(cityAssociationId: number, parentQuestionId: number): Promise<MatchTermAnswersResult> {
    const childQuestionsResponse = await get(`Quizzes/PublicQuestion/getList/${cityAssociationId}?parentId=${parentQuestionId}&ActiveStatusId=0&QuizCategoryId=0&QuizId=0&QuizTheme=None&QuestionType=None&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=True&PerPage=10`);
    const childQuestions = childQuestionsResponse.data.list ?? [];

    const items: MatchTermQuestionAnswers[] = [];

    for (const childQuestionDto of childQuestions) {
        const answersResponse = await get(`Quizzes/PublicAnswer/GetList?questionId=${childQuestionDto.id}&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=False&PerPage=10`);
        const answersList = (answersResponse.data.list ?? []).map((answerDto: any) => mapMatchAnswer(answerDto));

        const question = mapMatchQuestion(childQuestionDto);
        const correctAnswer = answersList.length > 0 ? answersList[0] : null;

        items.push({
            question,
            correctAnswer,
            answers: answersList
        });
    }

    return { items };
}

export type { QuizAnswerOption as QuizViewAnswerOption };
