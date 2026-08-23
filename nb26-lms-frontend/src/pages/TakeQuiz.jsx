import { useEffect, useState } from "react";
import { CheckCircle, ClipboardList, AlertCircle } from "lucide-react";
import { getQuiz, submitQuiz } from "../api";

function TakeQuiz() {
  const employeeId = "EMP001";
  const courseId = "CRS005";

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getQuiz(courseId);

        console.log("Quiz API:", data);

        setQuestions(
          Array.isArray(data?.questions) ? data.questions : []
        );
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (questions.length === 0) {
      setError("No quiz questions available.");
      return;
    }

    if (Object.keys(answers).length !== questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setResult(null);

      const data = await submitQuiz({
        employee_id: employeeId,
        course_id: courseId,
        answers,
      });

      console.log("Quiz submission:", data);

      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading-state">
          Loading quiz...
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3>Take Quiz</h3>
          <p>
            Course: {courseId} | Employee: {employeeId}
          </p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {result ? (
        <div className="quiz-result">
          <CheckCircle size={40} />

          <h3>
            {result.status === "passed"
              ? "Quiz Passed!"
              : "Quiz Failed"}
          </h3>

          <p>
            Score: <strong>{result.score}%</strong>
          </p>

          <p>
            Passing Score: <strong>{result.passing_score}%</strong>
          </p>

          <p>
            Correct Answers:{" "}
            <strong>
              {result.correct_answers}/{result.total_questions}
            </strong>
          </p>

          <p>
            Attempt: <strong>{result.attempt_count}/3</strong>
          </p>

          <span
            className={`status-pill ${
              result.status === "passed" ? "passed" : "failed"
            }`}
          >
            {result.status}
          </span>
        </div>
      ) : questions.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={28} />
          <p>No quiz questions found for this course.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <div
              className="quiz-question"
              key={question.question_id}
            >
              <h4>
                {index + 1}. {question.question_text}
              </h4>

              <div className="quiz-options">
                {question.options.map((option) => (
                  <label
                    key={option}
                    className="quiz-option"
                  >
                    <input
                      type="radio"
                      name={question.question_id}
                      value={option}
                      checked={
                        answers[question.question_id] === option
                      }
                      onChange={() =>
                        handleAnswerChange(
                          question.question_id,
                          option
                        )
                      }
                    />

                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="modal-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              <ClipboardList size={18} />

              {submitting
                ? "Submitting..."
                : "Submit Quiz"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default TakeQuiz;
