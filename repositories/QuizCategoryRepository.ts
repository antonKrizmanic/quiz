import prisma from "./db";

export const getQuizCategoriesWithQuestions = async (cityAssociationId: number, quizTheme: number) => {
    return await prisma.QuizCategories.findMany({
        where: {
          CityAssociationId: cityAssociationId,
          QuizTheme: quizTheme,
          IsActive: true,
          Questions: {
            some: {}
          }
        }
      });
}