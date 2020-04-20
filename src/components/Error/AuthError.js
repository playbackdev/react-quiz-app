import React from "react";
import classes from './AuthError.module.scss';

const AuthError = props => {

    const message = {
        "EMAIL_EXISTS": "Аккаунт с такой почтой уже существует",
        "TOO_MANY_ATTEMPTS_TRY_LATER": "Слишком много попыток, попробуйте позже",
        "EMAIL_NOT_FOUND": "Аккаунта с такой почтой не существует",
        "INVALID_PASSWORD": "Неверный пароль"
    };

    return (
        <div className={classes.Error}>
            {message[props.message]}
        </div>
    );
};

export default AuthError;