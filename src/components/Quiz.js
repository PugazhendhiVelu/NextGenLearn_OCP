import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quiz = ({ courseId }) => {
  const [quiz, setQuiz] = useState(null);  // To hold the quiz data
  const [answers, setAnswers] = useState({}); // To hold the user's answers
  const [result, setResult] = useState(null); // To display the result after submission

  // Fetch the quiz when the component is mounted
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // Fetch quiz data from your API
        const response = await axios.get(`/course/${courseId}/quiz`);
        setQuiz(response.data);  // Set the fetched quiz data
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();  // Call the function to fetch quiz
  }, [courseId]);

  // Handle the answer selection for each question
  const handleAnswerChange = (questionIndex, optionIndex) => {
    setAnswers({ ...answers, [questionIndex]: optionIndex }); // Store the selected answer
  };

  // Submit the quiz and calculate the score
  const handleSubmit = () => {
    let correctAnswers = quiz.questions.filter((q, index) => {
      return q.options[answers[index]]?.isCorrect; // Compare user's answer to the correct one
    });
    const score = (correctAnswers.length / quiz.questions.length) * 100;  // Calculate score
    setResult(score >= quiz.passingScore ? 'Passed' : 'Failed');  // Set pass/fail based on the score
  };

  // Render loading state if quiz data hasn't loaded yet
  if (!quiz) return <div>Loading quiz...</div>;

  return (
    <div>
      <h3>Quiz</h3>
      {/* Display quiz questions and options */}
      {quiz.questions.map((question, questionIndex) => (
        <div key={questionIndex} style={{ marginBottom: '20px' }}>
          <p>{question.questionText}</p>
          {question.options.map((option, optionIndex) => (
            <label key={optionIndex} style={{ display: 'block' }}>
              <input
                type="radio"
                name={`question-${questionIndex}`}  // Group radio buttons by question
                onChange={() => handleAnswerChange(questionIndex, optionIndex)} // Capture the user's answer
              />
              {option.optionText}
            </label>
          ))}
        </div>
      ))}

      {/* Submit button */}
      <button onClick={handleSubmit}>Submit</button>

      {/* Display the result after submission */}
      {result && <p>Quiz Result: {result}</p>}
    </div>
  );
};

export default Quiz;
