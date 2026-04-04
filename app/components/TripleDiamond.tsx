import React from 'react';
import './triple-diamond.css';

interface TripleDiamondProps {
  size?: number;
  color?: string;
  className?: string;
}

export const TripleDiamond: React.FC<TripleDiamondProps> = ({
  size = 30,
  color = '#ed1d24',
  className = '',
}) => {
  return (
    <div className={`triple-diamond ${className}`} style={{ '--diamond-size': `${size}px`, '--diamond-color': color } as React.CSSProperties}>
      <div className="diamond diamond-top" />
      <div className="diamond-row">
        <div className="diamond diamond-left" />
        <div className="diamond diamond-right" />
      </div>
    </div>
  );
};

export default TripleDiamond;
