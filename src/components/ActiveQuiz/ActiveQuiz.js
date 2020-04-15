import React from 'react';
import classes from './ActiveQuiz.module.css'
import AnswersList from "./AnswersList/AnswersList";

const ActiveQuiz = props => (
  <div className={classes.ActiveQuiz}>
      <p>
          <span>
              <strong>#{props.activeQuestion}</strong>&nbsp;
               {props.question}
          </span>
          <small>{props.activeQuestion} из {props.quizLength}</small>
      </p>

      <AnswersList
          state={props.state}
          answers={props.answers}
          onAnswerClick={props.onAnswerClick}
      />

  </div>
);

export default ActiveQuiz