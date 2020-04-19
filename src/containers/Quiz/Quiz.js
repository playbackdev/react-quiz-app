import React, {Component} from 'react'
import classes from './Quiz.module.css'
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz";
import FinishedQuiz from "../../components/FinishedQuiz/FinishedQuiz";
import Loader from "../../components/UI/Loader/Loader";
import {connect} from "react-redux";
import {fetchQuizById, quizAnswerClick, retryQuiz} from "../../store/actions/quiz";

class Quiz extends Component {

    componentDidMount() {
        this.props.fetchQuizById(this.props.match.params.id);
    }

    componentWillUnmount() {
        //обнуляем текущее прохождение теста при уходе со страницы
        this.props.retryQuiz();
    }

    render() {
        return (
            <div className={classes.Quiz}>
                {
                    this.props.loading || !this.props.quiz
                        ? <h1>Loading...</h1>
                        : <h1>{this.props.quizName}</h1>
                }
                {
                    this.props.loading || !this.props.quiz
                    ? <Loader/>
                    : this.props.isFinished
                        ? <FinishedQuiz
                            results={this.props.results}
                            quiz={this.props.quiz}
                            onRetry={this.props.retryQuiz}
                        />
                        : <ActiveQuiz
                            activeQuestion={1+this.props.activeQuestion}
                            quizLength={this.props.quiz.length}
                            question={this.props.quiz[this.props.activeQuestion].question}
                            answers={this.props.quiz[this.props.activeQuestion].answers}
                            onAnswerClick={this.props.quizAnswerClick}
                            state={this.props.answerState}
                        />
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        isFinished: state.quiz.isFinished,
        results: state.quiz.results, // {[id]: success or error}
        activeQuestion: state.quiz.activeQuestion,
        answerState: state.quiz.answerState, // { id: 'success' or 'error' }
        quiz: state.quiz.quiz,
        quizName: state.quiz.quizName,
        loading: state.quiz.loading
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchQuizById: (id) => dispatch(fetchQuizById(id)),
        quizAnswerClick: (answerId) => dispatch(quizAnswerClick(answerId)),
        retryQuiz: () => dispatch(retryQuiz())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Quiz);