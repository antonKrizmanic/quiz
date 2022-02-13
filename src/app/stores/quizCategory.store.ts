import { makeAutoObservable } from "mobx";
import { QuizCategoryQueryParameters } from "../models/quizCategoryQueryParameters";
import agent from "../api/agent";
import { QuizCategoryViewModel } from "../models/quizCategoryViewModel";


export class QuizCategoryStore {
    quizCategories: QuizCategoryViewModel[] = [];
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    loadCategories = async (params: QuizCategoryQueryParameters) => {
        this._setLoadingInitial(false);
        try {
            const paged = await agent.QuizCategories.list(params);
            this._mapQuizCategoriesPagedToArray(paged.list);
        } catch (error) {
            console.warn(error);
        } finally {
            this._setLoadingInitial(false);
        }
    };

    private _setLoadingInitial = (loadingInitial: boolean) => {
        this.loadingInitial = loadingInitial;
    };

    private _mapQuizCategoriesPagedToArray = (categories: QuizCategoryViewModel[]) => {
        this.quizCategories = categories;
    }
}