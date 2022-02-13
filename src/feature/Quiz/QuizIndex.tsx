import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router";
import MyPageTitle from "../../app/components/MyPageTitle";
import { QuizQueryParameters } from "../../app/models/quizQueryParameters";
import { useStore } from "../../app/stores/store";
import QuizList from "./QuizList";

const QuizIndex = () => {
    const { id } = useParams<{ id: string }>();
    const [idNumber, setIdNumber] = useState(0);
    const { quizStore } = useStore();
    const { quizes, loadQuizes, loadingInitial } = quizStore;

    useEffect(() => {
        setIdNumber(parseInt(id ? id : '', 10));
        if (idNumber > 0)
            loadQuizes(new QuizQueryParameters({ quizTheme: idNumber }));
    }, [idNumber])

    if (loadingInitial) {
        return (
            <MyPageTitle>
                Učitavanje kvizova u tijeku...
            </MyPageTitle>
        );
    }

    return (
        <>
            <MyPageTitle>
                Odaberite kviz
            </MyPageTitle>

            <div className="bg-gray-100 px-6 my-3 w-3/4 md:w-1/4 mx-auto">
                <div className="flex flex-col justify-center">
                    <QuizList quizes={quizes} quizTheme={idNumber} />
                </div>
            </div>
        </>
    );
}

export default observer(QuizIndex);