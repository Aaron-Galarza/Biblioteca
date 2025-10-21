import React from "react";

const ActionButton = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  onClick, 
  disabled = false,
  type = "button",
  className = "",
  ...props 
}) => {
  const baseClasses = "btn inline-flex items-center justify-center transition-all duration-300 hover:scale-105";
  const variantClasses = {
    primary: "btn-primary",
    success: "btn-success", 
    danger: "btn-danger",
    secondary: "btn-secondary",
    outline: "btn-outline"
  };
  const sizeClasses = {
    sm: "btn-sm",
    md: "",
    lg: "py-3 px-6 text-lg"
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default ActionButton;