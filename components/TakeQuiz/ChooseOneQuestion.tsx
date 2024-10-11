import React from 'react';
import { useEffect, useState } from 'react';
import { Radio, Typography } from "@material-tailwind/react";


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
      onAnswer(question.id, selectedAnswer);
    }
    console.log(selectedAnswerId);

  }

  return (
    <>
      <div className="py-3">
        <Typography type="lead" className="font-semibold">{questionIndex + 1}. {question.text}</Typography>
        <Typography type="small" className="font-light text-gray-600">(Odaberi samo jedan odgovor)</Typography>
        {!selectedAnswerId && <Typography type="small" className="font-light text-red-600">Molimo odaberite odgovor</Typography>}
      </div>
      {/* <Radio>
      {question.answers.map((option) => (        
          <div className="flex items-center gap-2">
            <Radio.Item
              key={option.id}
              id={option.id}              
              checked={selectedAnswerId === option.id}
              onChange={() => onAnswerSelect(option.id)}>
              <Radio.Indicator />
            </Radio.Item>
            <Typography as="label" htmlFor={option.id} className="text-foreground">
              {option.text}
            </Typography>
          </div>
        
      ))}
      </Radio> */}
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
    </>
  );
};

export default ChooseOneQuestion;