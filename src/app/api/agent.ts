import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
// import { store } from "../stores/store";
import { quizHistory } from '../../index';
import { PagedViewModel } from "../models/pagedViewModel";
import { QuizCategoryQueryParameters } from "../models/quizCategoryQueryParameters";
import { QuizCategoryViewModel } from "../models/quizCategoryViewModel";
import { QuizQueryParameters } from "../models/quizQueryParameters";
import { QuizViewModel } from "../models/quizViewModel";

axios.defaults.baseURL = "https://localhost:5011/api";

axios.interceptors.request.use((config) => {
    return config;
});

axios.interceptors.response.use(
    async (res) => {
        return res;
    },
    (error: AxiosError) => {
        const { data, status, config } = error.response!;

        switch (status) {
            case 400:
                // Handle basic bad request errors from the API
                if (typeof data === "string") {
                    toast.error(data);
                }
                // Handle bad request errors when fetching something with non-existent id
                // TODO: send back 404 error from server instead of 400
                if (config.method === "get" && data.errors.hasOwnProperty("id")) {
                    quizHistory.push("/not-found");
                }
                // Handle bad request validation errors
                if (data.errors) {
                    const modalStateErrors = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modalStateErrors.push(data.errors[key]);
                        }
                    }

                    throw modalStateErrors.flat();
                }
                break;
            case 401:
                toast.error("Unauthorised");
                break;
            case 403:
                quizHistory.push("/forbidden");
                break;
            case 404:
                quizHistory.push("/not-found");
                break;
            case 500:
                // store.commonStore.setServerError(data);
                quizHistory.push("/server-error");
                break;
        }

        return Promise.reject(error);
    }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) =>
        axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const QuizCategories = {
    list: (params: QuizCategoryQueryParameters) => requests.get<PagedViewModel<QuizCategoryViewModel>>(`/Quizzes/PublicQuizCategory/GetList/1?${serialize(params, '')}`)
};

const Quiz = {
    list: (params: QuizQueryParameters) => requests.get<PagedViewModel<QuizViewModel>>(`/Quizzes/PublicQuiz/GetList/1?${serialize(params, '')}`)
}

const serialize = (obj: any, prefix: string): string => {
    var str = [], p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                serialize(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
}

const agent = {
    QuizCategories,
    Quiz
};

export default agent;
