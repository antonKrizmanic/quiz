import React from 'react';
import { useEffect, useState } from 'react';

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
  onAnswer: (questionId: number, answer: Answer) => void;
  initialAnswer?: Answer;
}

const ChooseOneQuestion: React.FC<ChooseOneQuestionProps> = ({ question, questionIndex, onAnswer, initialAnswer }) => {
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);

  useEffect(() => {
    if (initialAnswer) {
      setSelectedAnswerId(initialAnswer.id);
    }
  }, [initialAnswer]);

  const onAnswerSelect = (answerId: number) => {
    const selectedAnswer = question.answers.find((answer) => answer.id === answerId);
    if (selectedAnswer) {
      setSelectedAnswerId(answerId);
      onAnswer(question.id,selectedAnswer);
    }
  }

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
              checked={selectedAnswerId === option.id}
              onChange={() => onAnswerSelect(option.id)}
            />
            {option.text}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseOneQuestion;