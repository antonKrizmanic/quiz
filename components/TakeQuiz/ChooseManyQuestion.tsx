import React, { useEffect, useState } from 'react';
import { Checkbox, Typography } from "@material-tailwind/react";

interface Answer {
  id: number;
  text: string;
  questionId: number;
}

interface ChooseManyQuestionProps {
  question: {
    id: number;
    text: string;
    answers: Answer[];
  };
  questionIndex: number;
  onAnswer: (questionId: number, answers: Answer[]) => void;
  initialAnswers?: Answer[];
}

const ChooseManyQuestion: React.FC<ChooseManyQuestionProps> = ({ question, questionIndex, onAnswer, initialAnswers }) => {
  const [selectedAnswers, setSelectedAnswers] = React.useState<Answer[]>([]);

  useEffect(() => {
    if (initialAnswers) {
      setSelectedAnswers(initialAnswers);
    }
  }, [initialAnswers]);


  const handleChange = (answerId: number) => {
    const answers = [...selectedAnswers];
    const index = answers.findIndex((answer) => answer.id === answerId);
    if (index > -1) {
      answers.splice(index, 1);
    } else {
      const selectedAnswer = question.answers.find((answer) => answer.id === answerId);
      if (selectedAnswer) {
        answers.push(selectedAnswer);
      }
    }
    setSelectedAnswers(answers);
    onAnswer(question.id, answers);
  };



  return (
    <>
      <div className="py-3">
        <Typography type="lead" className="font-semibold">{questionIndex + 1}. {question.text}</Typography>
        <Typography type="small" className="font-light text-gray-600">(Odaberi samo jedan odgovor)</Typography>
      </div>

      {/* {question.answers.map((option) => (
        <div className="flex items-center gap-2">
          <Checkbox
            key={option.id}
            id={option.id}
            onChange={() => handleChange(option.id)}
            checked={selectedAnswers.some((answer) => answer.id === option.id)}
          >
            <Checkbox.Indicator />
          </Checkbox>
          <Typography
            as="label"
            htmlFor={option.id}
            className="cursor-pointer text-foreground"
          >
            {option.text}
          </Typography>
        </div>
      ))} */}
      <div className="flex flex-col">
        {question.answers.map((option) => (
          <div key={option.id}>
            <label htmlFor={option.id} className="inline-block w-full py-1 lg:py-0 pl-1 lg:pl-0">
              <input
                className="mr-1"
                type="checkbox"
                id={option.id}
                name={`question-${question.id}`}
                value={option.id}
                checked={selectedAnswers.some((answer) => answer.id === option.id)}
                onChange={() => handleChange(option.id)}
              />
              {option.text}
            </label>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChooseManyQuestion;