import { QuestionType } from '@/types/quiz-public';

export const storyColor: Record<QuestionType, string> = {
    [QuestionType.SingleAnswer]: '#c8102e',
    [QuestionType.MultipleAnswers]: '#9c1c5b',
    [QuestionType.TextAnswer]: '#0f6e66',
    [QuestionType.MatchTerms]: '#2b3a8c',
};

export const storyCover = '#c8102e';

export function storyFinale(passed: boolean | null) {
    if (passed === true) return '#0b6b45';
    if (passed === false) return '#2b3a8c';
    return storyCover;
}

export const storyLabel: Record<QuestionType, string> = {
    [QuestionType.SingleAnswer]: 'Jedan odgovor',
    [QuestionType.MultipleAnswers]: 'Više odgovora',
    [QuestionType.TextAnswer]: 'Upišite odgovor',
    [QuestionType.MatchTerms]: 'Uparivanje',
};
