import { mapDtosToQuizCategories } from '@/mappers/QuizCategoryMapper';

import { get, } from '../services/HttpService';


export const getQuizCategoriesWithQuestions = async (cityAssociationId: number, quizTheme: number) => {
    const response = await get(`Quizzes/PublicQuizCategory/GetAllWithAnyQuestion/${cityAssociationId}/${quizTheme}`);
    console.log(response);
    return mapDtosToQuizCategories(response.data);
};