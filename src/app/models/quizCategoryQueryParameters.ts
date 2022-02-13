import { QueryStringParameters } from "./queryStringParameters";

export class QuizCategoryQueryParameters extends QueryStringParameters {
    quizTheme: number = 0;
    activeStatusId: number = 1;

    public constructor(init?: Partial<QuizCategoryQueryParameters>) {
        super();
        Object.assign(this, init);
    }
}

export enum QuizThemeEnum {
    FirstAid = 100,
    RedCrossKnowledge = 200
}