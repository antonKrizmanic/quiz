import { createContext, useContext } from "react";
import CommonStore from "./common.store";
import { QuizStore } from "./quiz.store";
import { QuizCategoryStore } from "./quizCategory.store";

interface Store {
    commonStore: CommonStore;
    quizCategoryStore: QuizCategoryStore;
    quizStore: QuizStore
}

export const store: Store = {
    commonStore: new CommonStore(),
    quizCategoryStore: new QuizCategoryStore(),
    quizStore: new QuizStore()
};

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}