import React from 'react';

interface TripleDiamondProps {
  size?: number;
  className?: string;
}

export const TripleDiamond: React.FC<TripleDiamondProps> = ({
  size = 30,
  className = '',
}) => {
  return (
    <img 
      src="/3 dots.png" 
      alt="Triple Diamond" 
      className={className}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};

export default TripleDiamond;
