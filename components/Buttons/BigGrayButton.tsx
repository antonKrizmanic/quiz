import React from 'react';

interface BigGrayButtonProps {
  cssClasses?: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const BigGrayButton: React.FC<BigGrayButtonProps> = ({ cssClasses, disabled, onClick, children }) => {
  var cssClas=`border border-gray-500 text-gray-500 text-center rounded-md px-4 py-2 `;
  if(!disabled)
  {
    cssClas += 'transition duration-500 ease select-none hover:text-white hover:bg-gray-600 focus:outline-none focus:shadow-outline ';
  }
  if(disabled)
  {
    cssClas += 'disabled:opacity-50 ';
  }

  if(cssClasses)
  {
    cssClas += cssClasses;
  }

  return (
    <button
      disabled={disabled}
      className={cssClas}      
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default BigGrayButton;