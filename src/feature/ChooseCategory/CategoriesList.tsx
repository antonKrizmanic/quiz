import { FC } from "react";
import RedButton from "../../app/components/RedButton";
import { QuizCategoryViewModel } from "../../app/models/quizCategoryViewModel";
interface IProps {
    categories: QuizCategoryViewModel[];
    quizTheme: number;
}
const CategoriesList: FC<IProps> = ({ categories, quizTheme }) => {
    if (!categories || categories.length <= 0) {
        return (
            <>
                <p className="text-center">Nije dohvaćena ni jedna kategorija</p>
                <RedButton href="/"><i className="fas fa-arrow-left"></i> Natrag</RedButton>
            </>
        );
    }
    return (
        <>

            <RedButton href={`/init-quiz/${quizTheme}`}>Sve</RedButton>
            {categories.map((category) => {
                return (
                    <RedButton href={`/init-quiz/${quizTheme}/${category.id}`}>{category.name}</RedButton>
                );
            })}
            <RedButton href={`/choose-quiz/${quizTheme}`}>Pogledaj već kreirane kvizove</RedButton>
            <RedButton href="/"><i className="fas fa-arrow-left"></i> Natrag</RedButton>
        </>
    );
}

export default CategoriesList;