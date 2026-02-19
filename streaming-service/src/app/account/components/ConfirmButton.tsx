import React from 'react';

const ConfirmButton = ({ 
  text, 
  onClick,
  type = 'button'
}: { 
  text: string; 
  onClick?: () => void;
  type?: 'button' | 'submit';
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition"
     >
      {text}
    </button>
  );
}

export default ConfirmButton