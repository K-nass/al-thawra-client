import React from 'react';

interface TripleDiamondProps {
  size?: number;
  className?: string;
}

export const TripleDiamond: React.FC<TripleDiamondProps> = ({
  size,
  className = "",
}) => {
  return (
    <img 
      src="/3-dots.png" 
      alt="Triple Diamond" 
      className={className}
      style={{
        width: size ? `${size / 25}em` : "1em",
        height: "auto",
        display: "inline-block",
        verticalAlign: "middle"
      }}
    />
  );
};

export default TripleDiamond;
