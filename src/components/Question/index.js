import { useState } from "react";
import "./index.css";

const Question = ({
  activeQuestion,
  updateScore,
  changeQuestionIndex,
  updateCorrect,
  updateWrong,
  changeIsCompleted,
  lengt,
  endQuiz
}) => {
  const [questionState, setQuestionState] = useState({
    userAnswer: "",
    isError: false,
    showAnswer: false
  });

  const { question, options, answer } = activeQuestion;
  const { userAnswer, isError, showAnswer } = questionState;

  const onSubmitAnswer = () => {
    if (!userAnswer) {
      setQuestionState({ ...questionState, isError: true });
    } else {
      const isCorrect = userAnswer === answer;
      // console.log(isCorrect, userAnswer, answer);
      if (isCorrect) {
        updateCorrect((prevState) => prevState + 1);
      } else {
        updateWrong((prevState) => prevState + 1);
      }
      updateScore((prevState) => (isCorrect ? prevState + 5 : prevState - 1));
      changeQuestionIndex((prevState) => {
        if (prevState === lengt - 1) {
          console.log(true);
          endQuiz(); // quiz is end if prevstate === length -1
          // changeIsCompleted(true);
        } else {
          return prevState + 1;
        }
      });
      // setting values to initial state
      setQuestionState({
        userAnswer: "",
        isError: false,
        showAnswer: false
      });
    }
  };
  // show answer function to show answer and reduce score with -1
  const changeShowAnswer = () => {
    setQuestionState({
      ...questionState,
      showAnswer: true
    });
    updateScore((prevState) => prevState - 1);
  };

  return (
    <div className="question-container">
      <h1 className="question">{question}</h1>
      <ul>
        {options.map((option) => (
          <li key={option}>
            <label
              className={
                showAnswer && answer === option ? "correct-option" : ""
              }
            >
              <input
                className={`answer-input ${showAnswer ? "correct-option" : ""}`}
                type="radio"
                name="answer"
                value={option}
                disabled={showAnswer}
                onChange={(e) => {
                  setQuestionState({
                    ...questionState,
                    userAnswer: e.target.value,
                    isError: false
                  });
                }}
              />
              {option}
            </label>
          </li>
        ))}
      </ul>
      {isError && <p className="error-msg">Please select an option</p>}
      {showAnswer && (
        <div className="dispay-answer">
          <p className="show-answer">{answer}</p>
        </div>
      )}
      <div className="buttons">
        {!showAnswer ? (
          <div className="button-container">
            <button type="button" className="button" onClick={changeShowAnswer}>
              SHOW ANSWER
            </button>
            <button
              type="button"
              className="button submit"
              onClick={onSubmitAnswer}
            >
              SUBMIT
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="button submit next"
            onClick={() => {
              changeQuestionIndex((prevState) => {
                if (prevState === lengt - 1) {
                  changeIsCompleted(true);
                } else {
                  return prevState + 1;
                }
              });
              setQuestionState({
                userAnswer: "",
                isError: false,
                showAnswer: false
              });
              updateWrong((prevState) => prevState + 1);
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Question;
