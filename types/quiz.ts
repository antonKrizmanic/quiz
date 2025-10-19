export enum QuestionType {
    SingleChoice = 1,
    MultipleChoice = 2,
    TextInput = 3,
    MatchTerms = 4,
}

export interface Answer {
    id: number;
    text: string;
    questionId: number;
    isCorrect?: boolean;
}

export interface Question {
    id: number;
    text: string;
}

export interface QuizAnswerOption {
    id: number;
    text: string;
    questionId: number;
}

export interface QuizQuestionDetail {
    id: number;
    text: string;
    questionType: QuestionType;
    parentId: number | null;
    children: QuizQuestionDetail[];
    answers: QuizAnswerOption[];
}

export interface QuizDetail {
    questions: QuizQuestionDetail[];
}

export interface QuizTakeAnswerDto {
    questionId: number;
    answerId: number;
    text: string;
    parentId?: number | null;
    parentQuestionId?: number | null;
}

export type QuizAnswerSelection =
    | QuizAnswerOption
    | QuizAnswerOption[]
    | QuizTakeAnswerDto[];

export type QuizAnswersState = Record<number, QuizAnswerSelection | undefined>;

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

export interface QuizTakeQuestion {
    questionId: number;
    answers: Answer[];
}

export interface QuizTakeViewModel {
    id: number;
    quizId: number;
    quizTitle: string;
    takeUserName: string;
    score: number;
    questionNumber: number;
    startedAt: Date;
    endedAt: Date;
    takeUserType: string;
}

export interface QuizTakeQuestionViewModel {
    id: number;
    questionId: number;
    text: string;
    index: number;
    parentId?: number | null;
    isCorrect: boolean;
    children: QuizTakeQuestionViewModel[];
    questionType: QuestionType;
    answers: Answer[];
}

export interface QuizTakeDetailViewModel extends QuizTakeViewModel {
    quizTakeQuestions: QuizTakeQuestionViewModel[];
}

export interface QuizTakeQuestionSubmissionDto {
    id: number;
    questionId: number;
    index: number;
    parentId?: number | null;
    answers: QuizTakeAnswerDto[];
}

export interface QuizCategory {
    id: number;
    name: string;
    isActiveDescription: string;
    quizTheme: number;
    description: string | null;
}

export interface MatchTermQuestionAnswers {
    question: Question;
    correctAnswer: Answer | null;
    answers: Answer[];
}

export interface MatchTermAnswersResult {
    items: MatchTermQuestionAnswers[];
}
