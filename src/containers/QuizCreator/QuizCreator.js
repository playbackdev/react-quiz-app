import React, {Component} from 'react';
import classes from './QuizCreator.module.css';
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import Select from "../../components/UI/Select/Select";
import {createControl, validate, validateFormForQuestion} from "../../form/formHandler";
import {connect} from "react-redux";
import {createQuizQuestion, finishCreateQuiz, resetQuizCreation} from "../../store/actions/create";

function createOptionControl(num) {
    return createControl({
        id: num,
        label: `Вариант ответа № ${num}`,
        errorMessage: 'Значение не может быть пустым',
        value: ''
    }, {required: true});
}

function createFormControls(quizName = '') {
    return {
        quizName: createControl({
            label: 'Название теста',
            errorMessage: 'Название не может быть пустым',
            value: quizName
        }, {required: true}),
        question: createControl({
            label: 'Введите вопрос',
            errorMessage: 'Вопрос не может быть пустым',
            value: ''
        }, {required: true}),
        option1: createOptionControl(1),
        option2: createOptionControl(2),
        option3: createOptionControl(3),
        option4: createOptionControl(4)
    };
}

class QuizCreator extends Component {

    state = {
        rightAnswerId: 1,
        formControls: createFormControls(),
        isFormValid: false,
    };

    submitHandler = event => {
        event.preventDefault();
    };

    addQuestionHandler = (event) => {
        event.preventDefault();
        this.validateInputs(['question','option1','option2','option3','option4']);
        //если валидная форма
        if(this.state.isFormValid) {
            const quizName = this.state.formControls.quizName.value;
            const index = this.props.questions.length + 1;
            const questionItem = {
                question: this.state.formControls.question.value,
                id: index,
                rightAnswerId: this.state.rightAnswerId,
                answers: [
                    {
                        text: this.state.formControls.option1.value,
                        id: this.state.formControls.option1.id
                    },
                    {
                        text: this.state.formControls.option2.value,
                        id: this.state.formControls.option2.id
                    },
                    {
                        text: this.state.formControls.option3.value,
                        id: this.state.formControls.option3.id
                    },
                    {
                        text: this.state.formControls.option4.value,
                        id: this.state.formControls.option4.id
                    },
                ]
            };
            //добавляем вопрос в стейт
            this.props.createQuizQuestion(questionItem);
            //изменяем состояние и обнуляем форму
            this.setState({
                rightAnswerId: 1,
                formControls: createFormControls(quizName),
                isFormValid: false
            });
        }

    };

    createQuizHandler = async (event) => {
        event.preventDefault();
        const quizName = this.state.formControls.quizName.value.trim();
        this.validateInputs(['quizName']);
        //если есть хотя бы один вопрос и форма валидна для создания теста
        if(this.props.questions.length !== 0 && quizName !== '') {
            this.props.finishCreateQuiz(quizName);
            //обнуляем стейт
            this.setState({
                rightAnswerId: 1,
                formControls: createFormControls(),
                isFormValid: false,
            });
        }
    };

    validateInputs = (names) => {
        //клонируем стейт контрола
        const formControls = { ...this.state.formControls };

        for(let name of names) {
            const control = {...formControls[name]};
            control.touched = true;
            control.valid = validate(control.value, control.validation);
            //обновляем объект контрола
            formControls[name] = control;
        }

        this.setState({
            formControls,
            isFormValid: validateFormForQuestion(formControls)
        });
    };

    onChangeHandler(value, controlName) {
        //клонируем стейт контрола
        const formControls = { ...this.state.formControls };
        const control = { ...formControls[controlName] };

        control.touched = true;
        control.value = value;
        control.valid = validate(control.value, control.validation);

        //обновляем объект контрола
        formControls[controlName] = control;

        this.setState({
            formControls,
            isFormValid: validateFormForQuestion(formControls)
        })

    }

    selectChangeHandler = event => {
        this.setState({
            rightAnswerId: +event.target.value
        })
    };

    renderInputs() {
        return Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName];

            return (
                <React.Fragment key={controlName + index}>
                    <Input
                        label={control.label}
                        type="text"
                        value={control.value}
                        valid={control.valid}
                        touched={control.touched}
                        errorMessage={control.errorMessage}
                        //либо просто true
                        shouldValidate={!!control.validation}
                        onChange={event => this.onChangeHandler(event.target.value, controlName)}
                    />
                    { index === 0 ? <div><hr/></div> : null }
                </React.Fragment>
            )
        })
    }

    renderSelect() {
        return (
            <Select
                label="Выберите правильный ответ"
                value={this.state.rightAnswerId}
                onChange={this.selectChangeHandler}
                options={[
                    {text: `1 ${this.state.formControls.option1.value}`, value: 1},
                    {text: `2 ${this.state.formControls.option2.value}`, value: 2},
                    {text: `3 ${this.state.formControls.option3.value}`, value: 3},
                    {text: `4 ${this.state.formControls.option4.value}`, value: 4}
                ]}
            />
        )
    }

    componentWillUnmount() {
        this.props.resetQuizCreation();
    }

    render() {
        return (
            <div className={classes.QuizCreator}>
                <h1>Создание теста</h1>

                <form onSubmit={this.submitHandler}>

                    { this.renderInputs() }

                    <div><hr/></div>

                    { this.renderSelect() }

                    <div>
                        <Button
                            type="primary"
                            onClick={this.addQuestionHandler}
                        >Добавить вопрос
                        </Button>
                        <Button
                            type="success"
                            onClick={this.createQuizHandler}
                        >Создать тест
                        </Button>
                    </div>
                    {
                        this.props.message !== ''
                            ? <div>
                                <p>{this.props.message}</p>
                            </div>
                            :null

                    }

                </form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        name: state.create.name,
        questions: state.create.questions,
        message: state.create.message
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createQuizQuestion: item => dispatch(createQuizQuestion(item)),
        finishCreateQuiz: (name) => dispatch(finishCreateQuiz(name)),
        resetQuizCreation: () => dispatch(resetQuizCreation())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizCreator);