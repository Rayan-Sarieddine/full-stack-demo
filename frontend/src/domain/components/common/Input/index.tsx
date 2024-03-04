import React from "react";

type InputProps = {
  type: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  autoComplete?: string;
  required?: boolean;
};

const Input = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  className,
  id,
  autoComplete,
  required = false,
}: InputProps) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      id={id}
      autoComplete={autoComplete}
      required={required}
    />
  );
};

export default Input;
