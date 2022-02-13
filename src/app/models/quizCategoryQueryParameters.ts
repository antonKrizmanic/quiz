import { QueryStringParameters } from "./queryStringParameters";

export class QuizCategoryQueryParameters extends QueryStringParameters {
    quizTheme: number = 0;
    activeStatusId: number = 0;
}

export enum QuizThemeEnum {
    FirstAid = 100,
    RedCrossKnowledge = 200
}