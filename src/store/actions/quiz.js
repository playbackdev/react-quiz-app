import axios from '../../axios/axios-quiz';
import {
    FETCH_QUIZ_SUCCESS,
    FETCH_QUIZES_ERROR,
    FETCH_QUIZES_START,
    FETCH_QUIZES_SUCCESS,
    QUIZ_FINISH,
    QUIZ_NEXT_QUESTION,
    QUIZ_RETRY,
    QUIZ_SET_STATE
} from "./actionTypes";

export function fetchQuizes() {
    return async (dispatch) => {
        dispatch(fetchQuizesStart());

        try {
            const response = await axios.get('quizes.json');

            const quizes = [];

            Object.keys(response.data).forEach((key) => {
                quizes.push({
                    id: key,
                    name: response.data[key].name
                });
            });

            dispatch(fetchQuizesSuccess(quizes))
        } catch(e) {
            dispatch(fetchQuizesError(e))
        }
    }
}

export function fetchQuizById(quizId) {
    return async (dispatch) => {
        //этот action подходит, т.к. просто перезаписывает loading на true
        dispatch(fetchQuizesStart());

        try {
            const response = await axios.get(`quizes/${quizId}.json`);
            const quiz = response.data.questions;
            const quizName = response.data.name;

            dispatch(fetchQuizSuccess(quiz,quizName))
        } catch(e) {
            dispatch(fetchQuizesError(e))
        }
    }

}

export function fetchQuizesStart() {
    return {
        type: FETCH_QUIZES_START
    }
}

export function fetchQuizesSuccess(quizes) {
    return {
        type: FETCH_QUIZES_SUCCESS,
        quizes
    }
}

export function fetchQuizSuccess(quiz, quizName) {
    return {
        type: FETCH_QUIZ_SUCCESS,
        quiz,
        quizName
    }
}

export function fetchQuizesError(e) {
    return {
        type: FETCH_QUIZES_ERROR,
        error: e
    }
}

export function quizAnswerClick(answerId) {
    return (dispatch, getState) => {
        const state = getState().quiz;
        console.log(state);
        //если у нас уже есть ответ, то проверяем
        //если ответ верный, то больше ошибочно не обрабатываем повторные клики
        if(state.answerState) {
            const key = Object.keys(state.answerState)[0];
            if(state.answerState[key] === 'success')
                return;
        }

        const question = state.quiz[state.activeQuestion];
        const results = {...state.results};

        //если ответили правильно
        if(question.rightAnswerId === answerId) {
            //еще не отвечали
            if(!results[question.id])
            {
                results[question.id] = 'success';
            }

            dispatch(quizSetState({[answerId]: 'success'}, results));

            const timeout = window.setTimeout(() => {
                if(isQuizFinished(state)) {
                    dispatch(finishQuiz())
                } else {
                    dispatch(quizNextQuestion(state.activeQuestion + 1))
                    // this.setState({
                    //     activeQuestion: this.state.activeQuestion + 1,
                    //     answerState: null
                    // });
                }
                window.clearTimeout(timeout);
            }, 1000);
        } else {
            results[question.id] = 'error';
            dispatch(quizSetState({[answerId]: 'error'}, results));
        }
    }
}
function isQuizFinished(state) {
    return state.activeQuestion + 1 === state.quiz.length;
}

export function retryQuiz() {
    return {
        type: QUIZ_RETRY
    }

}

export function quizSetState(answerState, results) {
    return {
        type: QUIZ_SET_STATE,
        answerState, results
    }
}

export function finishQuiz() {
    return {
        type: QUIZ_FINISH,
    }
}

export function quizNextQuestion(activeQuestion) {
    return {
        type: QUIZ_NEXT_QUESTION,
        activeQuestion
    }
}