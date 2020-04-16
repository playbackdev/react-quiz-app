import React, {Component} from 'react'
import classes from './Quiz.module.css'
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz";
import FinishedQuiz from "../../components/FinishedQuiz/FinishedQuiz";

class Quiz extends Component {
    state = {
        isFinished: false,
        results: {}, // {[id]: success or error}
        activeQuestion: 0,
        answerState: null, // { id: 'success' or 'error' }
        quiz: [
            {
                id: 1,
                question: 'Какого цвета небо?',
                rightAnswerId: 2,
                answers: [
                    {text: 'Черное', id: 1},
                    {text: 'Синее', id: 2},
                    {text: 'Красное', id: 3},
                    {text: 'Зеленое', id: 4}
                ]
            },
            {
                id: 2,
                question: 'В каком-году основали Санкт-Петербург',
                rightAnswerId: 3,
                answers: [
                    {text: '1667', id: 1},
                    {text: '1891', id: 2},
                    {text: '1703', id: 3},
                    {text: '1803', id: 4}
                ]
            }
        ]
    };

    onAnswerClickHandler = (answerId) => {
        //если у нас уже есть ответ, то проверяем
        //если ответ верный, то больше ошибочно не обрабатываем повторные клики
        if(this.state.answerState) {
           const key = Object.keys(this.state.answerState)[0];
           if(this.state.answerState[key] === 'success')
               return;
        }

        const question = this.state.quiz[this.state.activeQuestion];
        const results = {...this.state.results};

        //если ответили правильно
        if(question.rightAnswerId === answerId) {
            //еще не отвечали
            if(!results[question.id])
            {
                results[question.id] = 'success';
            }

            this.setState({
                answerState: {[answerId]: 'success'},
                results
            });

            const timeout = window.setTimeout(() => {
                if(this.isQuizFinished()) {
                    this.setState({
                        isFinished: true
                    });
                } else {
                    this.setState({
                        activeQuestion: this.state.activeQuestion + 1,
                        answerState: null
                    });
                }
                window.clearTimeout(timeout);
            }, 1000);
        } else {
            results[question.id] = 'error';
            this.setState({
                answerState: {[answerId]: 'error'},
                results: results
            });
        }
    };

    isQuizFinished() {
        return this.state.activeQuestion + 1 === this.state.quiz.length;
    }

    retryHandler = () => {
        this.setState({
            isFinished: false,
            results: {},
            activeQuestion: 0,
            answerState: null
        })
    };

    componentDidMount() {
        console.log('Quiz ID = ', this.props.match.params.id);
    }

    render() {
        return (
            <div className={classes.Quiz}>
                <h1>Quiz</h1>
                {this.state.isFinished
                    ? <FinishedQuiz
                        results={this.state.results}
                        quiz={this.state.quiz}
                        onRetry={this.retryHandler}
                    />
                    : <ActiveQuiz
                            activeQuestion={1+this.state.activeQuestion}
                            quizLength={this.state.quiz.length}
                            question={this.state.quiz[this.state.activeQuestion].question}
                            answers={this.state.quiz[this.state.activeQuestion].answers}
                            onAnswerClick={this.onAnswerClickHandler}
                            state={this.state.answerState}
                    />
                }
            </div>
        )
    }
}

export default Quiz