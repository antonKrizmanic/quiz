import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { QuizQueryParameters } from "../models/quizQueryParameters";
import { QuizViewModel } from "../models/quizViewModel";

export class QuizStore {
    quizes: QuizViewModel[] = [];
    loading = false;
    loadingInitial = false;
    constructor() {
        makeAutoObservable(this);
    }

    loadQuizes = async (params: QuizQueryParameters) => {
        this._setLoadingInitial(false);
        try {
            const paged = await agent.Quiz.list(params);
            this._mapQuizesPagedToQuizes(paged.list);
        } catch (error) {
            console.warn(error);
        } finally {
            this._setLoadingInitial(false);
        }
    }

    private _setLoadingInitial = (loadingInitial: boolean) => {
        this.loadingInitial = loadingInitial;
    };

    private _mapQuizesPagedToQuizes = (quizes: QuizViewModel[]) => {
        this.quizes = quizes;
    }
}