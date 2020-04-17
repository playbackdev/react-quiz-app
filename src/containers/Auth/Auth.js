import React, {Component} from 'react';
import classes from './Auth.module.css'
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import is from 'is_js';

export default class Auth extends Component {

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
        if(!this.state.isFormValid) {
            console.log('INVALID');
            return;
        }
        console.log('VALID');

    };

    registerHandler = () => {
        if(!this.state.isFormValid) {
            console.log('INVALID');
            return;
        }
        console.log('VALID');
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