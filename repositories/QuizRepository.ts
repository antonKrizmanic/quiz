import { get, post } from '@/services/HttpService';
import {
    type Answer as MatchAnswer,
    type Question as MatchQuestion,
    type MatchTermAnswersResult,
    type MatchTermQuestionAnswers,
    QuestionType,
    type QuizAnswerOption,
    type QuizAnswersState,
    type QuizDetail,
    type QuizQuestionDetail,
    type QuizTakeAnswerDto,
    type QuizTakeQuestionSubmissionDto,
    type SubmitQuizTakeParams,
} from '@/types/quiz';

function mapQuizAnswerOption(dto: any): QuizAnswerOption {
    return {
        id: dto.id,
        text: dto.text,
        questionId: dto.questionId,
    };
}

function mapQuizQuestionDetail(dto: any): QuizQuestionDetail {
    return {
        id: dto.id,
        text: dto.text,
        questionType: dto.questionType as QuestionType,
        parentId: dto.parentId ?? null,
        children: (dto.children ?? []).map((child: any) =>
            mapQuizQuestionDetail(child),
        ),
        answers: (dto.answers ?? []).map((answer: any) =>
            mapQuizAnswerOption(answer),
        ),
    };
}

function mapMatchQuestion(dto: any): MatchQuestion {
    return {
        id: dto.id,
        text: dto.text,
    };
}

function mapMatchAnswer(dto: any): MatchAnswer {
    return {
        id: dto.id,
        text: dto.text,
        questionId: dto.questionId,
        isCorrect: Boolean(dto.isCorrect),
    };
}

function mapQuizDetail(dto: any): QuizDetail {
    return {
        questions: (dto.questions ?? []).map((question: any) =>
            mapQuizQuestionDetail(question),
        ),
    };
}

export async function initializeQuiz(payload: {
    quizCategoryId: number | null;
    quizTheme: number | null;
    cityAssociationId: number;
}): Promise<number> {
    const requestBody = {
        QuizCategoryId: payload.quizCategoryId,
        QuizTheme: payload.quizTheme,
        CityAssociationId: payload.cityAssociationId,
    };

    const response = await post('quizzes/PublicQuiz', requestBody);
    return response.data;
}

export async function getQuizDetail(quizId: number): Promise<QuizDetail> {
    const response = await get(`quizzes/PublicQuiz/GetDetail/${quizId}`);
    return mapQuizDetail(response.data);
}

function mapStoredAnswersToDtos(
    question: QuizQuestionDetail,
    storedAnswer: QuizAnswersState[number],
): QuizTakeAnswerDto[] {
    if (!storedAnswer) {
        return [];
    }

    if (question.questionType === QuestionType.MatchTerms) {
        return Array.isArray(storedAnswer)
            ? (storedAnswer as QuizTakeAnswerDto[])
            : [];
    }

    if (Array.isArray(storedAnswer)) {
        return (storedAnswer as QuizAnswerOption[]).map(
            (answer) =>
                ({
                    questionId: question.id,
                    answerId: answer.id,
                    text: answer.text,
                    parentQuestionId: question.parentId ?? undefined,
                }) satisfies QuizTakeAnswerDto,
        );
    }

    const answer = storedAnswer as QuizAnswerOption;
    return [
        {
            questionId: question.id,
            answerId: answer.id,
            text: answer.text,
            parentQuestionId: question.parentId ?? undefined,
        },
    ];
}

export async function submitQuizTake(
    params: SubmitQuizTakeParams,
): Promise<number> {
    const questionDtos: QuizTakeQuestionSubmissionDto[] = params.questions.map(
        (question, index) => ({
            id: 0,
            questionId: question.id,
            index,
            parentId: question.parentId ?? undefined,
            answers: mapStoredAnswersToDtos(
                question,
                params.answers[question.id],
            ),
        }),
    );

    const requestBody = {
        quizId: params.quizId,
        startedAt: params.startedAt ?? null,
        endedAt: params.endedAt,
        takeUserName: params.takeUserName,
        takeUserType: params.takeUserType,
        questions: questionDtos,
        cityAssociationId: params.cityAssociationId,
    };

    const response = await post('quizzes/PublicQuizTake', requestBody);
    return response.data;
}

export async function getMatchTermQuestionAnswers(
    cityAssociationId: number,
    parentQuestionId: number,
): Promise<MatchTermAnswersResult> {
    const childQuestionsResponse = await get(
        `Quizzes/PublicQuestion/getList/${cityAssociationId}?parentId=${parentQuestionId}&ActiveStatusId=0&QuizCategoryId=0&QuizId=0&QuizTheme=None&QuestionType=None&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=True&PerPage=10`,
    );
    const childQuestions = childQuestionsResponse.data.list ?? [];

    const items: MatchTermQuestionAnswers[] = [];

    for (const childQuestionDto of childQuestions) {
        const answersResponse = await get(
            `Quizzes/PublicAnswer/GetList?questionId=${childQuestionDto.id}&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=False&PerPage=10`,
        );
        const answersList = (answersResponse.data.list ?? []).map(
            (answerDto: any) => mapMatchAnswer(answerDto),
        );

        const question = mapMatchQuestion(childQuestionDto);
        const correctAnswer =
            answersList.find((answer) => answer.isCorrect) ??
            (answersList.length > 0 ? answersList[0] : null);

        items.push({
            question,
            correctAnswer,
            answers: answersList,
        });
    }

    return { items };
}

export type { QuizAnswerOption as QuizViewAnswerOption };
