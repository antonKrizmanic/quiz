import React from 'react';

interface Answer {
    id: number;
    text: string;
    questionId: number;
}

interface ChooseOneQuestionProps {
  question: {
    id: number;
    text: string;
    answers: Answer[];
  };
  onAnswer: (answer: string) => void;
}

const ChooseOneQuestion: React.FC<ChooseOneQuestionProps> = ({ question, onAnswer }) => {
  return (
    <div>
      <p>{question.text}</p>
      {question.answers.map((option) => (
        <div key={option.id}>
          <input
            type="radio"
            id={option.id}
            name={`question-${question.id}`}
            value={option.id}
            onChange={() => onAnswer(option.text)}
          />
          <label htmlFor={option.id}>{option.text}</label>
        </div>
      ))}
    </div>
  );
};

export default ChooseOneQuestion;