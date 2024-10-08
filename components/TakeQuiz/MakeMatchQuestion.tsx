import React, { useEffect, useState } from 'react';

interface QuizTakeAnswerDto {
  questionId: number;
  answerId: number;
  parentId?: number;
  text: string;
}

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
  questionIndex: number;
  onAnswer: (questionId: number, answer: QuizTakeAnswerDto[]) => void;
}

const MakeMatchQuestion: React.FC<MakeMatchQuestionProps> = ({ question, questionIndex, onAnswer }) => {
  const [possibleAnswers, setPossibleAnswers] = useState<Answer[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<QuizTakeAnswerDto[]>([]);

  useEffect(() => {
    const answers = question.children?.map((child) => child.answers).flat() || [];
    setPossibleAnswers(answers);
  }, [question]);

  const handleSelectChange = (childId: number, answerId: string) => {
    console.log('something')
    const answer:QuizTakeAnswerDto = {
      questionId: childId,
      answerId: parseInt(answerId),
      parentId: question.id,
      text: '',
    };

    const answersArray = [...selectedAnswers];
    const index = answersArray.findIndex((a) => a.questionId === childId);
    if (index > -1) {
      answersArray[index] = answer;
    } else {
      answersArray.push(answer);
    }
    setSelectedAnswers(answersArray);
    onAnswer(answersArray);
  };

  return (
    <div>
      <div className="py-3">
        <p className="text-lg font-semibold">{questionIndex + 1}. {question.text}</p>
        <span className="text-sm font-light text-gray-600">(Spoji odgovarajuće pojmove)</span>
      </div>
      {question.children?.map((child) => (
        <div key={child.id} className="py-1">
          <div>
            <span>{child.text}
            </span>
          </div>
          <div>
            <select
              value={selectedAnswers[child.id] || null}
              onChange={(e) => handleSelectChange(child.id, e.target.value)}
              className="border border-gray-300 p-2 rounded block w-full"
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
        </div>
      ))}
    </div>
  );
};

export default MakeMatchQuestion;