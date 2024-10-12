// MatchTermAnswer.tsx
export interface Answer {
    id: number;
    text: string;
    questionId: number;
    isCorrect: boolean;
}

export interface Question {
    id: number;
    text: string;
}

export interface QuizTakeQuestion {
    questionId: number;
    answers: Answer[];
}

// page.tsx (take-result)
export interface QuizTakeDetailViewModel extends QuizTakeViewModel {
    quizTakeQuestions: QuizTakeQuestionViewModel[];
}

interface QuizTakeViewModel {
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

interface QuizTakeQuestionViewModel {    
    id: number;
    questionId: number;
    text: string;
    index: number;
    parentId?: number | null;
    isCorrect: boolean;
    children: QuizTakeQuestionViewModel[];
    questionType: number;
    answers: Answer[];
}