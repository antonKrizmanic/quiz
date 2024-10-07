import React from 'react';

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
onAnswer: (answer: string) => void;
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
      {question.answers.map((option) => (
        <div key={option.id}>
          <input
            type="checkbox"
            id={option.id}
            name={`question-${question.id}`}
            value={option.id}
            onChange={() => handleChange(option.text)}
          />
          <label htmlFor={option.id}>{option.text}</label>
        </div>
      ))}
    </div>
  );
};

export default ChooseManyQuestion;