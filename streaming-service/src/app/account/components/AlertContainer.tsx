import React from 'react';

type AlertType = 'success' | 'error' | 'warning';

type AlertProps = {
  type: AlertType;
  message: string;
};


const alertStyles: Record<AlertType, string> = {
  success: 'bg-green-600 border-green-700',
  error: 'bg-red-600 border-red-700',
  warning: 'bg-yellow-600 border-yellow-700'
};

const AlertContainer = ({ type, message }: AlertProps) => {
  return (
    <div className={`w-full p-4 rounded border-2 ${alertStyles[type]} text-white font-medium`}>
      {message}
    </div>
  );
};

export default AlertContainer;