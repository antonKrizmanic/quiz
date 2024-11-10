import { mapDtosToQuizCategories } from '@/mappers/QuizCategoryMapper';

import prisma from './db';

export const getQuizCategoriesWithQuestions = async (cityAssociationId: number, quizTheme: number) => {
    const data = await prisma.quizCategories.findMany({
        where: {
            CityAssociationId: cityAssociationId,
            QuizTheme: quizTheme,
            IsActive: true,
            Questions: {
                some: {}
            }
        }
    });

    return mapDtosToQuizCategories(data);
};