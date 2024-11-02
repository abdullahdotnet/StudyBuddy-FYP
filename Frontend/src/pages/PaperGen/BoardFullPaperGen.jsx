import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BoardFullPaperGen = () => {
  const { grade, subject } = useParams(); // Get grade and subject from the URL
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [evaluationResult, setEvaluationResult] = useState(null); // For MCQ evaluation result
  const [subjectiveEvaluationResult, setSubjectiveEvaluationResult] = useState(null); // For Subjective evaluation result
  const [totalScore, setTotalScore] = useState(0);

  // Fetch paper data dynamically based on grade and subject
  useEffect(() => {
    const fetchPaper = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          `http://localhost:8000/api/board/generate-full-paper/${grade}/${subject}/`,
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.status === 200) {
          setPaper(response.data);
        } else {
          setError("Failed to fetch the paper.");
        }
      } catch (err) {
        setError("An error occurred. Please check your network connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [grade, subject]);

  // Handle option selection for MCQs
  const handleOptionSelect = (questionId, option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: option,
    });
  };

  // Handle the "Evaluate Paper" action
  const handleEvaluatePaper = async () => {
    // Evaluate MCQs first
    const mcqResult = await evaluateMCQs();

    if (mcqResult) {
      // If MCQs are evaluated successfully, evaluate subjective questions
      await evaluateSubjective();
    }
  };

  // Function to evaluate MCQs
  const evaluateMCQs = async () => {
    try {
      const formattedQuestions = paper.objective.map((question) => ({
        id: question.id,
        question: question.question,
        options: question.options,
        user_answer: selectedAnswers[question.id] || null,
      }));

      const response = await axios.post("http://127.0.0.1:8000/api/board/evaluate-objective/", {
        questions: formattedQuestions,
      });

      if (response.status === 200) {
        setEvaluationResult(response.data.result);

        // Calculate total MCQ score
        const score = response.data.result.reduce((sum, res) => sum + parseInt(res.score, 10), 0);
        setTotalScore(score);
        return true; // Continue to subjective evaluation
      } else {
        setError("Failed to evaluate the MCQs.");
        return false;
      }
    } catch (err) {
      setError("An error occurred while evaluating MCQs.");
      return false;
    }
  };

  // Function to evaluate subjective answers
  const evaluateSubjective = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/test-session/evaluate-paper/", {
        paper_text: paper.subjective, // You might need to format this properly based on your API
        answer_images: [], // Attach files if any, else pass as an empty array
      });

      if (response.status === 200) {
        setSubjectiveEvaluationResult(response.data.results); // Store subjective evaluation result
      } else {
        setError("Failed to evaluate the subjective answers.");
      }
    } catch (err) {
      setError("An error occurred while evaluating subjective answers.");
    }
  };

  if (loading) return <p>Loading paper...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!paper) return <p>No paper available.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Full Board Paper (Grade {grade} - {subject})
      </h1>

      {/* Objective Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Objective Section</h2>
        {paper.objective && paper.objective.length > 0 ? (
          <div className="space-y-4">
            {paper.objective.map((question) => (
              <div key={question.id} className="border p-4 rounded-lg bg-gray-100">
                <h3 className="text-lg font-semibold mb-2">
                  {question.id}. {question.question}
                </h3>
                <div className="space-y-2">
                  {Object.entries(question.options).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        id={`question-${question.id}-option-${key}`}
                        value={key}
                        checked={selectedAnswers[question.id] === key}
                        onChange={() => handleOptionSelect(question.id, key)}
                        className="mr-2"
                      />
                      <label htmlFor={`question-${question.id}-option-${key}`} className="text-lg">
                        {`${key}) ${value}`}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No objective questions available.</p>
        )}
      </section>

      {/* Subjective Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Subjective Section</h2>
        <div className="space-y-8">
          {/* Section A */}
          {paper.subjective?.section_a && (
            <>
              <h3 className="text-xl font-bold mb-2">Section A</h3>
              <div className="border p-4 rounded-lg bg-gray-50">
                <p>{paper.subjective.section_a}</p>
              </div>
            </>
          )}

          {/* Section B */}
          {paper.subjective?.section_b && (
            <>
              <h3 className="text-xl font-bold mb-2">Section B</h3>
              <div className="border p-4 rounded-lg bg-gray-50">
                <p>{paper.subjective.section_b}</p>
              </div>
            </>
          )}
        </div>
      </section>

      <button
        onClick={handleEvaluatePaper}
        className="mt-6 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
      >
        Evaluate Paper
      </button>

      {/* Display MCQ Evaluation Result */}
      {evaluationResult && (
        <div className="mt-6 border p-4 rounded-lg bg-gray-200">
          <h2 className="text-2xl font-semibold mb-4">MCQs Evaluation Result</h2>
          {evaluationResult.map((res, index) => (
            <div key={index} className={`p-4 ${res.score === "1" ? "bg-green-100" : "bg-red-100"}`}>
              <p>
                Question {res.question_id}: {res.explanation}
              </p>
            </div>
          ))}
          <p className="text-xl font-bold mt-4">Total Score: {totalScore}</p>
        </div>
      )}

      {/* Display Subjective Evaluation Result */}
      {subjectiveEvaluationResult && (
        <div className="mt-6 border p-4 rounded-lg bg-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Subjective Evaluation Result</h2>
          {subjectiveEvaluationResult.map((result, index) => (
            <div key={index} className="p-4 bg-gray-100">
              <h3 className="text-lg font-semibold">Question {result.question_number}</h3>
              <p>{result.evaluation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardFullPaperGen;
