import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import MyPageTitle from "../../app/components/MyPageTitle";
import RedButton from "../../app/components/RedButton";
import { QuizCategoryQueryParameters } from "../../app/models/quizCategoryQueryParameters";
import { useStore } from "../../app/stores/store";
import CategoriesList from "./CategoriesList";


const ChooseCategory = () => {
    const { id } = useParams<{ id: string }>();
    const [idNumber, setIdNumber] = useState(0);
    const { quizCategoryStore } = useStore();
    const { quizCategories, loadCategories, loadingInitial } = quizCategoryStore;

    useEffect(() => {
        setIdNumber(parseInt(id ? id : '', 10));
        loadCategories(new QuizCategoryQueryParameters({ quizTheme: idNumber }));
    }, [idNumber]);

    if (loadingInitial) {
        return (
            <MyPageTitle>
                Učitavanje kategorija u tijeku...
            </MyPageTitle>
        );
    }

    return (
        <>
            <MyPageTitle>
                Odaberite kategoriju kviza
            </MyPageTitle>

            <div className="bg-gray-100 px-6 my-3 w-3/4 md:w-1/4 mx-auto">
                <div className="flex flex-col justify-center">
                    <CategoriesList categories={quizCategories} quizTheme={idNumber} />
                </div>
            </div>
        </>
    );
};

export default observer(ChooseCategory);