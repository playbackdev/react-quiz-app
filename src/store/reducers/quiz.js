import {
    FETCH_QUIZ_SUCCESS,
    FETCH_QUIZES_ERROR,
    FETCH_QUIZES_START,
    FETCH_QUIZES_SUCCESS,
    QUIZ_FINISH,
    QUIZ_NEXT_QUESTION, QUIZ_RETRY,
    QUIZ_SET_STATE
} from "../actions/actionTypes";

const initialState = {
    //quiz,quizlist - один loading на две страницы, т.к. они не пересекаются
    loading: false,
    //quizlist
    quizes: [],
    error: null,
    //quiz
    isFinished: false,
    results: {}, // {[id]: success or error}
    activeQuestion: 0,
    answerState: null, // { id: 'success' or 'error' }
    quiz: null,
    quizName: '',
};

export default function quizReducer(state = initialState, action) {
    switch(action.type) {
        //загрузка началась, возвращаем тот же стейт, только меняем loading = true
        case FETCH_QUIZES_START:
            return {
                ...state, loading: true
            };
        //загрузилось, перезаписываем loading на true и quizes на загруженные данные
        case FETCH_QUIZES_SUCCESS:
            return {
                ...state,
                loading: false,
                quizes: action.quizes
            };
        case FETCH_QUIZ_SUCCESS:
            return {
                ...state,
                loading: false,
                quiz: action.quiz,
                quizName: action.quizName
            };
        //ну если ошибка, то ошибка
        case FETCH_QUIZES_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error
            };
        case QUIZ_SET_STATE:
            return {
                ...state,
                answerState: action.answerState,
                results: action.results
            };
        case QUIZ_FINISH:
            return {
                ...state, isFinished: true
            };
        case QUIZ_NEXT_QUESTION:
            return {
                ...state,
                answerState: null,
                activeQuestion: action.activeQuestion
            };
        case QUIZ_RETRY:
            return {
                ...state,
                isFinished: false,
                results: {},
                activeQuestion: 0,
                answerState: null
            };
        default:
            return state;
    }
}