import React from 'react';

interface ChooseManyQuestionProps {
  question: {
    id: number;
    text: string;
    options: string[];
  };
  onAnswer: (answers: string[]) => void;
}

const ChooseManyQuestion: React.FC<ChooseManyQuestionProps> = ({ question, onAnswer }) => {
  const handleChange = (option: string) => {
    const answers = [...selectedAnswers];
    if (answers.includes(option)) {
      const index = answers.indexOf(option);
      answers.splice(index, 1);
    } else {
      answers.push(option);
    }
    setSelectedAnswers(answers);
    onAnswer(answers);
  };

  const [selectedAnswers, setSelectedAnswers] = React.useState<string[]>([]);

  return (
    <div>
      <p>{question.text}</p>
      {question.options.map((option) => (
        <div key={option}>
          <input
            type="checkbox"
            id={option}
            name={`question-${question.id}`}
            value={option}
            onChange={() => handleChange(option)}
          />
          <label htmlFor={option}>{option}</label>
        </div>
      ))}
    </div>
  );
};

export default ChooseManyQuestion;