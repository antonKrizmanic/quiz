import { ServerError } from "../models/serverError.model";
import { makeAutoObservable, reaction } from "mobx";

export default class CommonStore {
    error: ServerError | null = null;
    cityAssociationId: string | null = window.localStorage.getItem("cityAssociationId");
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);
    }

    setServerError = (error: ServerError) => {
        this.error = error;
    };

    setAppLoaded = () => {
        this.appLoaded = true;
    };

    setCityAssociationId = (cityAssociationId: string) => {
        this.cityAssociationId = "1";
    }
}