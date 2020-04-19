import React, {Component} from 'react';
import classes from './Auth.module.css'
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import is from 'is_js';
import {connect} from "react-redux";
import {auth} from "../../store/actions/auth";

class Auth extends Component {

    state = {
        isFormValid: false,
        formControls: {
            email: {
                value: '',
                type: 'email',
                label: 'Email',
                errorMessage: 'Введите корректный email',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    email: true
                }
            },
            password: {
                value: '',
                type: 'password',
                label: 'Пароль',
                errorMessage: 'Введите корректный пароль (не менее 6 символов)',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    minLength: 6
                }
            }
        }
    };

    loginHandler = () => {
        this.validateInputs(['email', 'password']);
        if(this.state.isFormValid) {
            this.props.auth(
                this.state.formControls.email.value,
                this.state.formControls.password.value,
                true
            );
        }
    };

    registerHandler = () => {
        this.validateInputs(['email', 'password']);
        if(this.state.isFormValid) {
            this.props.auth(
                this.state.formControls.email.value,
                this.state.formControls.password.value,
                false
            );
        }
    };

    submitHandler = (event) => {
        event.preventDefault();

    };

    validateControl(value, validation) {
        if(!validation) {
            return true;
        }

        let isValid = true;

        if(validation.required) {
            //в конце && isValid - если isValid уже до этого false - тогда
            //в любом случае - false // для первой проверки это не очень актуально
            //но зачем-то добавили, на всякий случай
            isValid = value.trim() !== '' && isValid;
        }

        if(validation.email) {
            //в конце && isValid - если isValid уже до этого false - тогда
            //в любом случае - false
            isValid = is.email(value) && isValid;
        }

        if(validation.minLength) {
            //в конце && isValid - если isValid уже до этого false - тогда
            //в любом случае - false
            isValid = value.length >= validation.minLength && isValid;

        }

        return isValid;

    }

    validateInputs = (names) => {
        //клонируем стейт контрола
        const formControls = { ...this.state.formControls };

        for(let name of names) {
            const control = {...formControls[name]};
            control.touched = true;
            control.valid = this.validateControl(control.value, control.validation);
            //обновляем объект контрола
            formControls[name] = control;
        }

        //валидация всей формы
        let isFormValid = true;

        Object.keys(formControls).forEach(name => {
            isFormValid = formControls[name].valid && isFormValid;
        });

        this.setState({
            formControls,
            isFormValid
        });
    };

    onChangeHandler = (event, controlName) => {
        //копируем объекты из стейта
        const formControls = { ...this.state.formControls };
        const control = { ...formControls[controlName] };
        //обновляем все значения в копии
        control.value = event.target.value;
        control.touched = true;
        control.valid = this.validateControl(control.value, control.validation);
        formControls[controlName] = control;

        //валидация всей формы
        let isFormValid = true;

        Object.keys(formControls).forEach(name => {
           isFormValid = formControls[name].valid && isFormValid;
        });

        //обновляем стейт
        this.setState({
            formControls, isFormValid
        });
    };

    renderInputs() {
        return Object.keys(this.state.formControls)
            .map((controlName, index) => {
                const control = this.state.formControls[controlName];
                return (
                    <Input
                        key={controlName + index}
                        type={control.type}
                        value={control.value}
                        valid={control.valid}
                        touched={control.touched}
                        label={control.label}
                        errorMessage={control.errorMessage}
                        //либо просто true
                        shouldValidate={!!control.validation}
                        onChange={event => this.onChangeHandler(event, controlName)}
                    />
            )
        });
    }

    render() {
        return (
            <div className={classes.Auth}>
                <div>
                    <h1>Авторизация</h1>

                    <form onSubmit={this.submitHandler}>

                        { this.renderInputs() }

                        <div>
                            <Button
                            type="success"
                            onClick={this.loginHandler}
                            >Войти
                            </Button>
                            <Button
                                type="primary"
                                onClick={this.registerHandler}
                            >Зарегистрироваться
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        auth: (email, password, isLogin) => dispatch(auth(email, password, isLogin))
    }
}

export default connect(null, mapDispatchToProps)(Auth);