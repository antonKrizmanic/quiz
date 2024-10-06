import React from 'react';

interface BigRedButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const BigRedButton: React.FC<BigRedButtonProps> = ({ onClick, children }) => {
  return (
    <button
      className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition-colors duration-300 mt-4"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default BigRedButton;