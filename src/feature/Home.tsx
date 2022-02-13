import { useEffect } from "react";
import BigRedButton from "../app/components/BigRedButton"
import MyPageTitle from "../app/components/MyPageTitle"
import { QuizCategoryQueryParameters } from "../app/models/quizCategoryQueryParameters";
import { useStore } from "../app/stores/store";

const Home = () => {
    const { quizCategoryStore } = useStore();
    useEffect(() => {
        quizCategoryStore.loadCategories(new QuizCategoryQueryParameters());
    }, []);

    return (
        <>
            {/* Title */}
            <MyPageTitle>
                Odaberite temu kviza
            </MyPageTitle >
            {/* End Title */}
            {/* Buttons */}
            <div className="bg-gray-100 px-6 my-3 w-3/4 md:w-1/4 mx-auto">
                <div className="flex flex-col justify-center">
                    <BigRedButton href="/choose-category/100">Prva pomoć</BigRedButton>
                    <BigRedButton href="/choose-category/200">Pokret Crvenog križa</BigRedButton>
                </div>
            </div>
            {/* End Buttons */}
        </>
    );
};

export default Home;