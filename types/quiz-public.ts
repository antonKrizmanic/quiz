export enum QuestionType {
    SingleAnswer = 1,
    MultipleAnswers = 2,
    TextAnswer = 3,
    MatchTerms = 4,
}

export interface PublicQuizInstance {
    id: number;
    name: string | null;
    description: string | null;
    questionCount: number;
}

export interface PublicQuestionCategory {
    id: number;
    name: string;
    parentCategoryId: number | null;
    sortOrder: number;
    availableQuestionCount: number;
}

export interface PublicQuizCatalogItem {
    quizId: number;
    instanceId: number;
    publicCode: string;
    name: string;
    description: string | null;
    questionCount: number;
}

export interface PaginationMetadata {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
}

export interface PagedResponse<T> {
    list: T[];
    metadata: PaginationMetadata;
}

export interface QuizOption {
    id: string;
    text: string;
}

export interface MatchSelection {
    leftOptionId: string;
    rightOptionId: string;
}

export interface PublicQuizQuestion {
    id: number;
    type: QuestionType;
    text: string;
    maximumPoints: number;
    choices: QuizOption[];
    leftOptions: QuizOption[];
    rightOptions: QuizOption[];
    selectedChoiceIds: string[];
    textAnswer: string | null;
    selectedMatches: MatchSelection[];
}

export interface InProgressQuiz {
    attemptId: number;
    quizName: string | null;
    questions: PublicQuizQuestion[];
}

export interface StartedQuizAttempt {
    attemptId: number;
    accessToken: string;
    quiz: InProgressQuiz;
}

export interface QuizQuestionResult {
    question: PublicQuizQuestion;
    isCorrect: boolean;
    score: number;
    correctChoiceIds: string[];
    acceptedTextAnswers: string[];
    correctMatches: MatchSelection[];
    explanation: string | null;
}

export interface QuizResult {
    attemptId: number;
    quizName: string | null;
    score: number;
    maximumScore: number;
    percentage: number;
    passed: boolean | null;
    questions: QuizQuestionResult[];
}

export interface QuizAnswer {
    choiceOptionIds: string[];
    text: string | null;
    matches: MatchSelection[];
}

export interface QuizSession {
    attemptId: number;
    accessToken: string;
}
