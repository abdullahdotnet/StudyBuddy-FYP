import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ObjectivePaperGen = () => {
  const { grade, subject } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {

        const response = await fetch(`http://localhost:8000/api/board/generate-objective/${grade}/${subject}/`, {

          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (response.ok) {
          setQuestions(data.questions);
        } else {
          setError("Failed to fetch questions.");
        }
      } catch (err) {
        setError("An error occurred. Please check your network connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [grade, subject]);

  const handleOptionChange = (questionId, option) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: option,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedQuestions = questions.map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options,
      user_answer: selectedAnswers[question.id] || null,
    }));

    try {

      const response = await fetch(`http://localhost:8000/api/board/evaluate-objective/${grade}/${subject}/`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: formattedQuestions }),
      });
      const resultData = await response.json();
      if (response.ok) {
        setEvaluationResult(resultData.result);

        // Calculate total score
        const score = resultData.result.reduce((sum, res) => sum + parseInt(res.score, 10), 0);
        setTotalScore(score);
      } else {
        setError("Failed to evaluate the answers.");
      }
    } catch (err) {
      setError("An error occurred. Please check your network connection.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Objective Paper</h1>

      <form onSubmit={handleSubmit}>
        {loading ? (
          <p>Loading questions...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : questions.length === 0 ? (
          <p>No questions available.</p>
        ) : (
          questions.map((question) => {
            const evaluation = evaluationResult?.find((res) => res.question_id === question.id);
            const score = evaluation?.score;

            return (
              <div
                key={question.id}
                className={`mb-6 border p-4 rounded-lg ${score === "1" ? "bg-green-100" : score === "0" ? "bg-red-100" : "bg-gray-100"
                  }`}
              >
                <h3 className="text-lg font-semibold mb-2">
                  {question.id}. {question.question}
                </h3>
                <div className="space-y-2">
                  {Object.entries(question.options).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={key}
                        checked={selectedAnswers[question.id] === key}
                        onChange={() => handleOptionChange(question.id, key)}
                        className="mr-2"
                      />
                      <label className="text-lg">{`${key}) ${value}`}</label>
                    </div>
                  ))}
                </div>

                {evaluation && (
                  <div className="mt-2">
                    <p className="font-semibold">Explanation:</p>
                    <p>{evaluation.explanation}</p>
                  </div>
                )}
              </div>
            );
          })
        )}

        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded transition-all hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      {/* Display total score */}
      {evaluationResult && (
        <div className="mt-6 border p-4 rounded-lg bg-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Total Score</h2>
          <p className="text-xl font-bold mb-4">Total Score: {totalScore} / {questions.length}</p>
        </div>
      )}
    </div>
  );
};

export default ObjectivePaperGen;
