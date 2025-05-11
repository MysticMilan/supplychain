import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'destructive';
  className?: string;
}

export function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400',
    destructive: 'bg-red-900 text-white hover:bg-red-950 focus:ring-red-800'
  };

  return (
    <button
      className={`
        p-2.5 rounded-lg shadow-md transition duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-opacity-50
        ${!disabled && 'transform hover:scale-105'}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed hover:bg-opacity-100' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
