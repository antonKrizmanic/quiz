import { QueryStringParameters } from "./queryStringParameters";

export class QuizQueryParameters extends QueryStringParameters {
    quizTheme: number = 0;
    quizCategoryId: number = 0;
    questionId: number = 0;
    isActiveStatusId: number = 1;
    isManuallyCreatedStatusId: number = 1;

    public constructor(init?: Partial<QuizQueryParameters>) {
        super();
        Object.assign(this, init);
    }
}