import { useState, useEffect, useRef } from "react";
import questionsData from "./questions.json";
import Question from "./components/Question";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import "./App.css";

const App = () => {
  const [questionsList, updateQuestionList] = useState(questionsData);
  const [score, updateScore] = useState(0);
  const [correct, updateCorrect] = useState(0);
  const [wrong, updateWrong] = useState(0);
  const [isCompleted, changeIsCompleted] = useState(false);
  const [currentQuestionIndex, changeQuestionIndex] = useState(0);
  const [timeElapsedInSeconds, setTimeElapsedInSeconds] = useState(0);
  const [totalTimeInSeconds, updateTotalTimeInSec] = useState(0);
  const timerInterval = useRef(null);

  useEffect(() => {
    updateTotalTimeInSec(
      (prevTotalTime) => prevTotalTime + timeElapsedInSeconds
    );
    setTimeElapsedInSeconds(0);
    if (!isCompleted) {
      timerInterval.current = setInterval(() => {
        setTimeElapsedInSeconds((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(timerInterval.current);
    };
  }, [isCompleted, currentQuestionIndex]);

  const shuffledQuizList = () => {
    return questionsList.sort(() => Math.random() - 0.5);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const endQuiz = () => {
    if (!isCompleted) {
      updateTotalTimeInSec(
        (prevTotalTime) => prevTotalTime + timeElapsedInSeconds
      );
      clearInterval(timerInterval.current);
    }
    changeIsCompleted(true);
  };

  const reStartQuiz = () => {
    if (!isCompleted) {
      updateTotalTimeInSec(
        (prevTotalTime) => prevTotalTime + timeElapsedInSeconds
      );
    }
    clearInterval(timerInterval.current);
    changeIsCompleted(false);
    changeQuestionIndex(0);
    updateCorrect(0);
    updateWrong(0);
    setTimeElapsedInSeconds(0);
    updateQuestionList(shuffledQuizList);
  };

  return (
    <div className="app-container">
      <nav>
        <h3 className="nav-heading">Quiz App</h3>
        <div className="score-container">
          <span className="score-heading">Score: </span>
          <span className="score">{score}</span>
        </div>
        <div className="timer">
          <p className="time">{formatTime(timeElapsedInSeconds)}</p>
          <button
            type="button"
            className="end-practice-button"
            onClick={endQuiz}
          >
            * END PRACTICE
          </button>
        </div>
      </nav>
      {!isCompleted && currentQuestionIndex < questionsList.length && (
        <Question
          activeQuestion={questionsList[currentQuestionIndex]}
          updateScore={updateScore}
          changeQuestionIndex={changeQuestionIndex}
          updateCorrect={updateCorrect}
          updateWrong={updateWrong}
          length={questionsList.length}
          changeIsCompleted={changeIsCompleted}
          lengt={questionsList.length}
          endQuiz={endQuiz}
        />
      )}
      {isCompleted && (
        <div className="result-container">
          <div className="result">
            <h1 className="result-score">{score}</h1>
            <div className="date-time-container">
              <p className="date-time">{new Date().toLocaleDateString()}</p>
              <p className="date-time">{formatTime(totalTimeInSeconds)}</p>
            </div>
            <p className="correct">
              <span className="answer-count">{correct}</span>
              Correct answers
              <TiTick className="icon" />
            </p>
            <p className="correct">
              <span className="answer-count">{wrong}</span> Wrong answers
              <RxCross2 className="icon" />
            </p>
            <p className="correct">
              <span className="answer-count">
                {questionsList.length - (correct + wrong)}
              </span>{" "}
              Not answered •
            </p>
            <button
              type="button"
              className="button"
              onClick={() => {
                reStartQuiz();
                updateScore(0);
                updateTotalTimeInSec(0);
              }}
            >
              Practice Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
