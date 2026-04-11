import React from 'react';

interface TripleDiamondProps {
  size?: number;
  className?: string;
}

export const TripleDiamond: React.FC<TripleDiamondProps> = ({
  size,
}) => {
  return (
    <img 
      src="/3-dots.png" 
      alt="Triple Diamond" 
      style={{width:"25px"}}
    />
  );
};

export default TripleDiamond;
