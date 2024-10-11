import React, { useEffect, useState } from 'react';
import { Typography } from "@material-tailwind/react";

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
    <>
      <div className="py-3">
        <Typography type="lead" className="font-semibold">{questionIndex + 1}. {question.text}</Typography>
        <Typography type="small" className="font-light text-gray-600">(Upiši točan odgovor)</Typography>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={answer}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded block w-full"
        />
      </div>

    </>
  );
};

export default TypeAnswerQuestion;