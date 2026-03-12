import React from 'react';

export default function Button({
  text,
  icon,
  onClick,
  type = "button",
  variant = "solid",
  size = "md",
  fullWidth = false,
  className = "",
  disabled = false,
}) {
  const baseStyle = "cursor-pointer flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-md",
    lg: "px-6 py-3 text-lg",
  };

  const variants = {
    solid: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300",
    outline: "bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500 disabled:border-indigo-300 disabled:text-indigo-300",
    ghost: "bg-transparent text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${widthClass} ${className}`}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {text}
    </button>
  );
}