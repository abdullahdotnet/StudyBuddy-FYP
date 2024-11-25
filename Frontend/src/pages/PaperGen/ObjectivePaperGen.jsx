import React, { useState, useEffect } from "react";

const ObjectivePaperGen = () => {
  // Initialize states with proper types
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);  // Start with loading true
  const [error, setError] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch questions when component mounts
  useEffect(() => {
    let mounted = true;  // Add mounted flag for cleanup

    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/test-session/generate-paper/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        
        if (!mounted) return;  // Don't update state if component unmounted

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setQuestions(data.questions || []);  // Ensure we always set an array
        setError(null);
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to fetch questions");
          setQuestions([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchQuestions();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []);  // Empty dependency array means this runs once on mount

  const handleOptionChange = (questionId, option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formattedQuestions = questions.map((question) => ({
        id: question.id,
        question: question.question,
        options: question.options,
        user_answer: selectedAnswers[question.id] || null,
      }));

      const response = await fetch("http://localhost:8000/api/test-session/evaluate-paper/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: formattedQuestions }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resultData = await response.json();
      setEvaluationResult(resultData.result);
      
      // Calculate total score safely
      const score = (resultData.result || []).reduce(
        (sum, res) => sum + (parseInt(res.score, 10) || 0),
        0
      );
      setTotalScore(score);
    } catch (err) {
      setError(err.message || "Failed to evaluate answers");
      setEvaluationResult(null);
      setTotalScore(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading questions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Objective Paper</h1>

      {questions.length === 0 ? (
        <p className="text-gray-600">No questions available.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question) => {
            const evaluation = evaluationResult?.find(
              (res) => res.question_id === question.id
            );
            const score = evaluation?.score;

            return (
              <div
                key={question.id}
                className={`p-4 rounded-lg shadow ${
                  score === "1"
                    ? "bg-green-50 border border-green-200"
                    : score === "0"
                    ? "bg-red-50 border border-red-200"
                    : "bg-white border border-gray-200"
                }`}
              >
                <h3 className="text-lg font-semibold mb-3">
                  {question.id}. {question.question}
                </h3>
                <div className="space-y-3">
                  {Object.entries(question.options).map(([key, value]) => (
                    <label
                      key={key}
                      className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={key}
                        checked={selectedAnswers[question.id] === key}
                        onChange={() => handleOptionChange(question.id, key)}
                        className="form-radio h-4 w-4 text-blue-600"
                        disabled={evaluationResult !== null}
                      />
                      <span className="text-gray-700">{`${key}) ${value}`}</span>
                    </label>
                  ))}
                </div>

                {evaluation && (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <p className="font-semibold text-gray-700">Explanation:</p>
                    <p className="text-gray-600">{evaluation.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={isSubmitting || evaluationResult !== null}
            className={`w-full md:w-auto mt-6 px-6 py-2 rounded-lg font-semibold text-white 
              ${
                isSubmitting || evaluationResult !== null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}

      {evaluationResult && (
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">Results</h2>
          <p className="text-xl font-bold text-blue-800">
            Total Score: {totalScore} / {questions.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default ObjectivePaperGen;