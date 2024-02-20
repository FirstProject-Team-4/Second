

import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  color?: string;
  id?: string;
}

const Button: React.FC<ButtonProps> = ({ children = null, onClick = () => { }, color = "", id = '' }) => {

  return (
    <>
      <button id={id} style={color ? { border: `2px solid ${color}` } : undefined} onClick={onClick}>{children}</button>
    </>
  );
}

export default Button;
