import { createContext, useContext } from "react";
import CommonStore from "./common.store";
import { QuizCategoryStore } from "./quizCategory.store";

interface Store {
    commonStore: CommonStore;
    quizCategoryStore: QuizCategoryStore
}

export const store: Store = {
    commonStore: new CommonStore(),
    quizCategoryStore: new QuizCategoryStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}