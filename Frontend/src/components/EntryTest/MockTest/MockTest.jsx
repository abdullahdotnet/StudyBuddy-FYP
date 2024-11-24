import React, { useState, useEffect } from 'react';

const MockTest = () => {
  const [questions, setQuestions] = useState([]); // State to hold fetched questions
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown
  const [showResults, setShowResults] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [filter, setFilter] = useState('all'); // 'all', 'correct', 'wrong'
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [questionsLoaded, setQuestionsLoaded] = useState(false); // State to track if questions are loaded
  const questionsPerPage = 10;

  // Calculate the number of attempted questions
  const attemptedQuestions = Object.keys(selectedOptions).length;

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/entrytest/generate-entry-test/');
      const data = await response.json();
      console.log(data.mcq_paper);        
      setQuestions(data.mcq_paper); 
      setQuestionsLoaded(true); // Mark questions as loaded to start the timer

    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
 // Empty dependency array to run only on component mount

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && questionsLoaded && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      alert('Your time is up!');
      handleSubmit();
    }
  }, [timeLeft, questionsLoaded, showResults]);

  const handleOptionChange = (questionId, optionIndex) => {
    setSelectedOptions({ ...selectedOptions, [questionId]: optionIndex });
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedOptions[q.id] === q.answer) {
        correct += 1;
      }
    });
    setCorrectAnswers(correct);
    setShowResults(true);
    setCurrentPage(1); // Reset to first page after submission
  };

  const filteredQuestions = questions.filter((q) => {
    if (filter === 'correct') return selectedOptions[q.id] === q.answer;
    if (filter === 'wrong') return selectedOptions[q.id] !== q.answer;
    return true;
  });

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Timer and Attempted Questions Counter */}
      {!showResults && (
        <div className="flex justify-between items-center mb-6">
        {/* <h1 className="text-3xl font-bold">Mock Test</h1> */}
        <div onClick={fetchQuestions} className='text-xl font-semibold bg-green-100 text-green-700 py-2 px-4 rounded shadow"'>
          Generate Mock Test</div>
          <div className="text-xl font-semibold bg-blue-100 text-blue-700 py-2 px-4 rounded shadow">
            Time Left: {formatTime(timeLeft)}
          </div>
          <div className="text-xl font-semibold bg-green-100 text-green-700 py-2 px-4 rounded shadow">
            Attempted: {attemptedQuestions} / {questions.length}
          </div>
        </div>
      )}

      {/* Questions with Question ID */}
      {!showResults &&
        currentQuestions.map((q) => (
          <div key={q.id} className="bg-white p-6 mb-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">
              {q.id}. {q.question} {/* Use the question's id here */}
            </h2>
            <div className="flex flex-col space-y-2">
              {q.options.map((option, i) => (
                <label
                  key={i}
                  className={`flex items-center p-3 border rounded cursor-pointer transition duration-300 ${selectedOptions[q.id] === i
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={i}
                    checked={selectedOptions[q.id] === i}
                    onChange={() => handleOptionChange(q.id, i)}
                    className="hidden"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}

      {/* Submit Button */}
      {!showResults && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Submit Test
          </button>
        </div>
      )}

      {/* Result Display */}
      {showResults && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Results</h2>
          <div className="mb-4">
            <button
              className={`py-2 px-4 rounded mr-2 ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => {
                setFilter('all');
                setCurrentPage(1); // Reset to first page when filter changes
              }}
            >
              Show All
            </button>
            <button
              className={`py-2 px-4 rounded mr-2 ${filter === 'correct' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              onClick={() => {
                setFilter('correct');
                setCurrentPage(1); // Reset to first page when filter changes
              }}
            >
              Show Correct
            </button>
            <button
              className={`py-2 px-4 rounded ${filter === 'wrong' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
              onClick={() => {
                setFilter('wrong');
                setCurrentPage(1); // Reset to first page when filter changes
              }}
            >
              Show Wrong
            </button>
          </div>

          {/* Display questions with numbers after submission */}
          {currentQuestions.map((q) => (
            <div key={q.id} className="bg-white p-6 mb-6 rounded-lg shadow-md">
              {/* Displaying question ID along with the question */}
              <h2 className="text-xl font-semibold mb-4">
                {q.id}. {q.question} {/* Use the question's id here */}
              </h2>
              <div className="flex flex-col space-y-2">
                {q.options.map((option, idx) => (
                  <div
                    key={idx}
                    className={`p-3 border rounded ${selectedOptions[q.id] === idx
                      ? selectedOptions[q.id] === q.answer
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-red-500 text-white border-red-500'
                      : 'bg-white text-gray-800 border-gray-300'
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display Correct Answers */}
      {showResults && (
        <div className="text-center mt-4">
          <h3 className="text-xl font-bold">
            You got {correctAnswers} out of {questions.length} questions correct.
          </h3>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`py-2 px-4 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MockTest;


// import React, { useState, useEffect } from 'react';
// import { questions } from '../../../utils/data';

// const MockTest = () => {
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown
//   const [showResults, setShowResults] = useState(false);
//   const [correctAnswers, setCorrectAnswers] = useState(0);
//   const [filter, setFilter] = useState('all'); // 'all', 'correct', 'wrong'
//   const [currentPage, setCurrentPage] = useState(1); // Pagination state
//   const questionsPerPage = 10;

//   // Calculate the number of attempted questions
//   const attemptedQuestions = Object.keys(selectedOptions).length;

//   useEffect(() => {
//     if (timeLeft > 0 && !showResults) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     } else if (timeLeft === 0 && !showResults) {
//       alert('Your time is up!');
//       handleSubmit();
//     }
//   }, [timeLeft, showResults]);

//   const handleOptionChange = (questionId, optionIndex) => {
//     setSelectedOptions({ ...selectedOptions, [questionId]: optionIndex });
//   };

//   const handleSubmit = () => {
//     let correct = 0;
//     questions.forEach((q) => {
//       if (selectedOptions[q.id] === q.answer) {
//         correct += 1;
//       }
//     });
//     setCorrectAnswers(correct);
//     setShowResults(true);
//     setCurrentPage(1); // Reset to first page after submission
//   };

//   const filteredQuestions = questions.filter((q) => {
//     if (filter === 'correct') return selectedOptions[q.id] === q.answer;
//     if (filter === 'wrong') return selectedOptions[q.id] !== q.answer;
//     return true;
//   });

//   const indexOfLastQuestion = currentPage * questionsPerPage;
//   const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
//   const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const sec = seconds % 60;
//     return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
//   };

//   const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Timer and Attempted Questions Counter */}
//       {!showResults && (
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold">Mock Test</h1>
//           <div className="text-xl font-semibold bg-blue-100 text-blue-700 py-2 px-4 rounded shadow">
//             Time Left: {formatTime(timeLeft)}
//           </div>
//           <div className="text-xl font-semibold bg-green-100 text-green-700 py-2 px-4 rounded shadow">
//             Attempted: {attemptedQuestions} / {questions.length}
//           </div>
//         </div>
//       )}

//       {/* Questions with Question ID */}
//       {!showResults &&
//         currentQuestions.map((q) => (
//           <div key={q.id} className="bg-white p-6 mb-6 rounded-lg shadow-md">
//             <h2 className="text-2xl font-semibold mb-4">
//               {q.id}. {q.question} {/* Use the question's id here */}
//             </h2>
//             <div className="flex flex-col space-y-2">
//               {q.options.map((option, i) => (
//                 <label
//                   key={i}
//                   className={`flex items-center p-3 border rounded cursor-pointer transition duration-300 ${selectedOptions[q.id] === i
//                     ? 'bg-blue-500 text-white border-blue-500'
//                     : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100'
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name={`question-${q.id}`}
//                     value={i}
//                     checked={selectedOptions[q.id] === i}
//                     onChange={() => handleOptionChange(q.id, i)}
//                     className="hidden"
//                   />
//                   {option}
//                 </label>
//               ))}
//             </div>
//           </div>
//         ))}

//       {/* Submit Button */}
//       {!showResults && (
//         <div className="flex justify-center">
//           <button
//             onClick={handleSubmit}
//             className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300"
//           >
//             Submit Test
//           </button>
//         </div>
//       )}

//       {/* Result Display */}
//       {showResults && (
//         <div className="mb-6">
//           <h2 className="text-2xl font-bold mb-4">Results</h2>
//           <div className="mb-4">
//             <button
//               className={`py-2 px-4 rounded mr-2 ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//               onClick={() => {
//                 setFilter('all');
//                 setCurrentPage(1); // Reset to first page when filter changes
//               }}
//             >
//               Show All
//             </button>
//             <button
//               className={`py-2 px-4 rounded mr-2 ${filter === 'correct' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
//               onClick={() => {
//                 setFilter('correct');
//                 setCurrentPage(1); // Reset to first page when filter changes
//               }}
//             >
//               Show Correct
//             </button>
//             <button
//               className={`py-2 px-4 rounded ${filter === 'wrong' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
//               onClick={() => {
//                 setFilter('wrong');
//                 setCurrentPage(1); // Reset to first page when filter changes
//               }}
//             >
//               Show Wrong
//             </button>
//           </div>

//           {/* Display questions with numbers after submission */}
//           {currentQuestions.map((q) => (
//             <div key={q.id} className="bg-white p-6 mb-6 rounded-lg shadow-md">
//               {/* Displaying question ID along with the question */}
//               <h2 className="text-xl font-semibold mb-4">
//                 {q.id}. {q.question} {/* Use the question's id here */}
//               </h2>
//               <div className="flex flex-col space-y-2">
//                 {q.options.map((option, idx) => (
//                   <div
//                     key={idx}
//                     className={`p-3 border rounded ${selectedOptions[q.id] === idx
//                       ? selectedOptions[q.id] === q.answer
//                         ? 'bg-green-500 text-white border-green-500'
//                         : 'bg-red-500 text-white border-red-500'
//                       : 'bg-white text-gray-800 border-gray-300'
//                     }`}
//                   >
//                     {option}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Display Correct Answers */}
//       {showResults && (
//         <div className="text-center mt-4">
//           <h3 className="text-xl font-bold">
//             You got {correctAnswers} out of {questions.length} questions correct.
//           </h3>
//         </div>
//       )}

//       {/* Pagination Controls */}
//       <div className="flex justify-center mt-6 space-x-2">
//         {Array.from({ length: totalPages }, (_, i) => (
//           <button
//             key={i + 1}
//             onClick={() => paginate(i + 1)}
//             className={`py-2 px-4 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
//               }`}
//           >
//             {i + 1}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MockTest;
