import { QuizCategory } from "@/component-models/types";

export function mapDtosToQuizCategories(dtos: any[]): QuizCategory[] {
    return dtos.map((dto) => {
        const quizCategory: QuizCategory = {
            id: dto.Id,
            name: dto.Name,
            isActiveDescription: dto.IsActiveDescription,
            quizTheme: dto.QuizTheme,
            description: dto.Description
        };

        return quizCategory;
    });
}