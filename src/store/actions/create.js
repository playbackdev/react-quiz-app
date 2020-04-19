import {QUIZ_CREATION_RESET, QUIZ_QUESTION_CREATE} from "./actionTypes";
import axios from '../../axios/axios-quiz';

export function createQuizQuestion(item) {
    return {
        type: QUIZ_QUESTION_CREATE,
        item
    }
}

export function resetQuizCreation(message = '') {
    return {
        type: QUIZ_CREATION_RESET,
        message
    };
}

export function finishCreateQuiz(name) {
    return async (dispatch, getState) => {
        const state = {...getState().create, name};
        await axios.post('quizes.json', state);
        dispatch(resetQuizCreation(`Тест "${name}" успешно создан`))
    }
}