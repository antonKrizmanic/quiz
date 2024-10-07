import React, { useEffect, useState } from 'react';

interface Answer {
  id: number;
  text: string;
  questionId: number;
}

interface Question {
  id: number;
  text: string;
  questionType: string;
  options: string[];
  parentId: number | null;
  children: Question[] | null;
  answers: Answer[];
}

interface MakeMatchQuestionProps {
  question: Question;
  onAnswer: (answer: { questionId: string; answerId: string }[]) => void;
}

const MakeMatchQuestion: React.FC<MakeMatchQuestionProps> = ({ question, onAnswer }) => {
  const [possibleAnswers, setPossibleAnswers] = useState<Answer[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const answers = question.children?.map((child) => child.answers).flat() || [];
    setPossibleAnswers(answers);
  }, [question]);

  const handleSelectChange = (childId: number, answerId: string) => {
    const updatedSelectedAnswers = { ...selectedAnswers, [childId]: answerId };
    setSelectedAnswers(updatedSelectedAnswers);

    const answersArray = Object.keys(updatedSelectedAnswers).map((key) => ({
      questionId: key,
      answerId: updatedSelectedAnswers[parseInt(key)],
    }));

    onAnswer(answersArray);
  };

  return (
    <div>
      <p>{question.text}</p>
      {question.children?.map((child) => (
        <div key={child.id} className="mb-4">
          <p>{child.text}</p>
          <select
            value={selectedAnswers[child.id] || ''}
            onChange={(e) => handleSelectChange(child.id, e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="" disabled>
              Select an answer
            </option>
            {possibleAnswers.map((answer) => (
              <option key={answer.id} value={answer.id.toString()}>
                {answer.text}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default MakeMatchQuestion;