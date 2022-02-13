import { FC } from "react";
import RedButton from "../../app/components/RedButton";
import { QuizViewModel } from "../../app/models/quizViewModel";

interface IProps {
    quizes: QuizViewModel[];
    quizTheme: number;
}

const QuizList: FC<IProps> = ({ quizes, quizTheme }) => {
    if (!quizes || quizes.length <= 0) {
        return (
            <>
                <p className="text-center">Nije dohvaćena ni jedan kviz</p>
                <RedButton href={`/choose-category/${quizTheme}`}><i className="bi-arrow-left-circle"></i> Natrag</RedButton>
            </>
        );
    }

    return (
        <>
            {quizes.map((quiz) => {
                return (
                    <RedButton key={quiz.id} href={`/init-quiz/${quizTheme}/${quiz.quizCategoryId}/${quiz.id}`}>{quiz.title}</RedButton>
                );
            })}
            <RedButton href={`/choose-category/${quizTheme}`}><i className="bi-arrow-left-circle"></i> Natrag</RedButton>
        </>
    );
}

export default QuizList;