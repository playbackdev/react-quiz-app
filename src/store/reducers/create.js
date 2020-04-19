import {QUIZ_CREATION_RESET, QUIZ_QUESTION_CREATE} from "../actions/actionTypes";

const initialState = {
    name: '',
    questions: [],
    message: ''
};

export default function createReducer(state = initialState, action) {
    switch(action.type) {
        case QUIZ_QUESTION_CREATE:
            return {
                ...state,
                //добавляем в массив новый вопрос и заменяем новым массивом
                questions: [...state.questions, action.item],
                message: `Добавлено вопросов: ${state.questions.length + 1}`
            };
        case QUIZ_CREATION_RESET:
            return {
                name: '',
                questions: [],
                message: action.message
            };
        default:
            return state;
    }

}