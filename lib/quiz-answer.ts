import type { PublicQuizQuestion, QuizAnswer } from '@/types/quiz-public';
import { QuestionType } from '@/types/quiz-public';

export function answerFromQuestion(question: PublicQuizQuestion): QuizAnswer {
    return {
        choiceOptionIds: [...question.selectedChoiceIds],
        text: question.textAnswer,
        matches: [...question.selectedMatches],
    };
}

export function sameAnswer(a: QuizAnswer, b: QuizAnswer): boolean {
    const ids = (answer: QuizAnswer) =>
        [...answer.choiceOptionIds].sort().join('\u001f');
    const pairs = (answer: QuizAnswer) =>
        answer.matches
            .map((match) => `${match.leftOptionId}\u001e${match.rightOptionId}`)
            .sort()
            .join('\u001f');
    return (
        ids(a) === ids(b) &&
        (a.text ?? '') === (b.text ?? '') &&
        pairs(a) === pairs(b)
    );
}

export function hasAnswer(
    question: PublicQuizQuestion,
    answer: QuizAnswer,
): boolean {
    switch (question.type) {
        case QuestionType.SingleAnswer:
        case QuestionType.MultipleAnswers:
            return answer.choiceOptionIds.length > 0;
        case QuestionType.TextAnswer:
            return Boolean(answer.text?.trim());
        case QuestionType.MatchTerms:
            return answer.matches.length > 0;
    }
}
