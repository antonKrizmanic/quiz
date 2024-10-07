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
  questionIndex: number;
  onAnswer: (answer: string) => void;
}

const ChooseOneQuestion: React.FC<ChooseOneQuestionProps> = ({ question, questionIndex, onAnswer }) => {
  return (
    <div>
      <div className="py-3">
        <p className="text-lg font-semibold">{questionIndex + 1}. {question.text}</p>
        <span className="text-sm font-light text-gray-600">(Odaberi samo jedan odgovor)</span>
      </div>
      <div className="flex flex-col">
        {question.answers.map((option) => (
          <div key={option.id}>
            <label htmlFor={option.id} className="inline-block w-full py-1 lg:py-0 pl-1 lg:pl-0">
            <input
              className="mr-1"
              type="radio"
              id={option.id}
              name={`question-${question.id}`}
              value={option.id}
              onChange={() => onAnswer(option.text)}
            />
            {option.text}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseOneQuestion;