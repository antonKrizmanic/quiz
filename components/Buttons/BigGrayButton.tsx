import React from 'react';

interface BigGrayButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const BigGrayButton: React.FC<BigGrayButtonProps> = ({ onClick, children }) => {
  return (
    <button
      className="border border-gray-500 text-gray-500 text-center rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:text-white hover:bg-gray-600 focus:outline-none focus:shadow-outline"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default BigGrayButton;