import { QuizCategory } from '@/types/quiz';

export function mapDtosToQuizCategories(dtos: any[]): QuizCategory[] {
    return dtos.map((dto) => {
        const quizCategory: QuizCategory = {
            id: dto.id,
            name: dto.name,
            isActiveDescription: dto.isActiveDescription,
            quizTheme: dto.quizTheme,
            description: dto.description
        };

        return quizCategory;
    });
}