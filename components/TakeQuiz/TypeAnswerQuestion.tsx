import React from 'react';

interface TypeAnswerQuestionProps {
  question: {
    id: number;
    text: string;
  };
  questionIndex: number;
  onAnswer: (answer: string) => void;
}

const TypeAnswerQuestion: React.FC<TypeAnswerQuestionProps> = ({ question, questionIndex, onAnswer }) => {
  return (
    <div>
      <div className="py-3">
        <p className="text-lg font-semibold">{questionIndex + 1}. {question.text}</p>
        <span className="text-sm font-light text-gray-600">(Upiši točan odgovor)</span>
      </div>
      <div className="mb-4">
        <input
          type="text"
          onChange={(e) => onAnswer(e.target.value)}
          className="border border-gray-300 p-2 rounded block w-full"
        />
      </div>

    </div>
  );
};

export default TypeAnswerQuestion;