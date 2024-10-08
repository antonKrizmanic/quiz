import React from 'react';

interface BigRedButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled: boolean;
}

const BigRedButton: React.FC<BigRedButtonProps> = ({ onClick, children, disabled }) => {
  var cssClass = 'border border-red-500 text-red-500 px-4 py-2 rounded mt-4'

  if(disabled)
  {
    cssClass += ' disabled:opacity-50';
  }
  if(!disabled)
  {
    cssClass += ' hover:bg-red-500 hover:text-white transition-colors duration-300'
  }

  return (
    <button
      disabled={disabled}
      className={cssClass}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default BigRedButton;