import React from 'react';

interface TypeAnswerQuestionProps {
  question: {
    id: number;
    text: string;
  };
  onAnswer: (answer: string) => void;
}

const TypeAnswerQuestion: React.FC<TypeAnswerQuestionProps> = ({ question, onAnswer }) => {
  return (
    <div>
      <p>{question.text}</p>
      <input
        type="text"
        onChange={(e) => onAnswer(e.target.value)}
        className="border border-gray-300 p-2 rounded"
      />
    </div>
  );
};

export default TypeAnswerQuestion;