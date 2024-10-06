import React from 'react';

interface MakeMatchQuestionProps {
  question: {
    id: number;
    text: string;
    options: { left: string; right: string }[];
  };
  onAnswer: (answer: { left: string; right: string }[]) => void;
}

const MakeMatchQuestion: React.FC<MakeMatchQuestionProps> = ({ question, onAnswer }) => {
  // Implement the matching logic here
  return (
    <div>
      <p>{question.text}</p>
      {/* Render matching options */}
    </div>
  );
};

export default MakeMatchQuestion;