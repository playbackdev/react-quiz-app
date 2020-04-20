import firebaseConfig from "../../firebaseConfig/firebaseConfig";
import axios from 'axios';
import {AUTH_ERROR, AUTH_LOGOUT, AUTH_SUCCESS} from "./actionTypes";

export function auth(email, password, isLogin) {
    return async dispatch => {
        const authData = {
            email,
            password,
            returnSecureToken: true
        };
        let url = firebaseConfig.REGISTER_URL;
        if(isLogin) {
            url = firebaseConfig.LOGIN_URL;
        }
        try {
            const response = await axios.post(url, authData);
            const data = response.data;

            const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000);
            localStorage.setItem('token', data.idToken);
            localStorage.setItem('userId', data.localId);
            localStorage.setItem('expirationDate', expirationDate);

            dispatch(authSuccess(data.idToken));
            dispatch(autoLogout(data.expiresIn));
        } catch(e) {
            dispatch(authError(e.response.data.error.message));
        }
    }
}

export function authSuccess(token) {
    return {
        type: AUTH_SUCCESS,
        token
    }
}

export function authError(error) {
    return {
        type: AUTH_ERROR,
        error
    }
}

export function autoLogin() {
    return dispatch => {
        const token = localStorage.getItem('token');
        if(!token) {
            dispatch(logout())
        } else {
            const expirationDate = localStorage.getItem('expirationDate');
            if(expirationDate <= new Date()) {
                dispatch(logout())
            } else {
                dispatch(authSuccess(token));
                dispatch(autoLogout((new Date(expirationDate).getTime() - new Date().getTime()) / 1000));
            }
        }
    }
}

export function autoLogout(time) {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, time * 1000)
    }
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');
    return {
        type: AUTH_LOGOUT
    }
}