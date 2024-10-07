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
  questionIndex: number;
  onAnswer: (answer: string) => void;
}

const ChooseManyQuestion: React.FC<ChooseManyQuestionProps> = ({ question, questionIndex, onAnswer }) => {
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
      <div className="py-3">
        <p className="text-lg font-semibold">{questionIndex + 1}. {question.text}</p>
        <span className="text-sm font-light text-gray-600">(Možeš odabrati više odgovora)</span>
      </div>
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
                onChange={() => handleChange(option.text)}
              />
              {option.text}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseManyQuestion;