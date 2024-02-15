

import React, { CSSProperties } from "react";

interface ButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
    color?: string;
}

const Button: React.FC<ButtonProps> = ({ children = null, onClick = () => {}, color = "" }) => {

  return (
    <>
      <button style={color ? { border: `2px solid ${color}` } : undefined} onClick={onClick}>{children}</button>
    </>
  );
}

export default Button;
