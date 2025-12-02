import { memo } from 'react';
import type { ControlButtonProps } from '../types';

function ControlButtonComponent({
  icon,
  label,
  onClick,
  disabled = false,
  active = false,
  className = '',
}: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`
        group relative flex items-center justify-center
        w-9 h-9 rounded-lg
        text-white/90 hover:text-white
        hover:bg-white/15 active:bg-white/20
        transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
        focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-black/20
        ${active ? 'bg-white/15 text-white' : ''}
        ${className}
      `}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
}

export const ControlButton = memo(ControlButtonComponent);
