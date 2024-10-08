import React, { useEffect, useState } from 'react';

interface TypeAnswerQuestionProps {
  question: {
    id: number;
    text: string;
  };
  questionIndex: number;
  onAnswer: (questionId: number, answer: string) => void;
  initialAnswer?: string;
}

const TypeAnswerQuestion: React.FC<TypeAnswerQuestionProps> = ({ question, questionIndex, onAnswer, initialAnswer }) => {
  const [answer, setAnswer] = useState<string>('');

  useEffect(() => {
    if (initialAnswer) {
      setAnswer(initialAnswer);
    }
  }, [initialAnswer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAnswer(value);
    onAnswer(question.id, value);
  };

  return (
    <div>
      <div className="py-3">
        <p className="text-lg font-semibold">{questionIndex + 1}. {question.text}</p>
        <span className="text-sm font-light text-gray-600">(Upiši točan odgovor)</span>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={answer}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded block w-full"
        />
      </div>

    </div>
  );
};

export default TypeAnswerQuestion;