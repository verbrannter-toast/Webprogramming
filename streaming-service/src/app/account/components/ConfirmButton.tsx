import React from 'react';

const ConfirmButton = ({ 
  text, 
  onClick 
}: { 
  text: string; 
  onClick: () => void 
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition"
     >
      {text}
    </button>
  );
}

export default ConfirmButton