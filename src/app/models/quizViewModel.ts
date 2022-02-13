export interface QuizViewModel {
    id: number;
    title: string;
    description: string;
    availableFrom: Date;
    availableTo: Date;
    quizTheme: number;
    quizCategoryName: string
    quizCategoryId: number;
}