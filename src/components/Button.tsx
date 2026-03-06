'use client';

import { CalcButton } from '@/lib/calculate';

interface ButtonProps {
  button: CalcButton;
  onClick: (value: string) => void;
}

export default function Button({ button, onClick }: ButtonProps) {
  const getButtonStyle = () => {
    switch (button.type) {
      case 'clear':
        return 'bg-[#e94560] hover:bg-[#ff5575] text-white shadow-lg shadow-red-900/30';
      case 'operator':
        return 'bg-[#533483] hover:bg-[#6340a0] text-white shadow-lg shadow-purple-900/30';
      case 'equals':
        return 'bg-[#e94560] hover:bg-[#ff5575] text-white shadow-lg shadow-red-900/30';
      case 'function':
        return 'bg-[#1a3a6e] hover:bg-[#234d96] text-[#a0b4cc] hover:text-white shadow-lg shadow-blue-900/20';
      case 'number':
      default:
        return 'bg-[#0f3460] hover:bg-[#1a4a7a] text-white shadow-lg shadow-blue-900/20';
    }
  };

  return (
    <button
      onClick={() => onClick(button.value)}
      className={`
        btn-press no-select
        h-16 w-full rounded-2xl
        flex items-center justify-center
        font-medium text-xl
        transition-colors duration-100
        focus:outline-none focus:ring-2 focus:ring-[#e94560]/50
        ${getButtonStyle()}
      `}
      aria-label={button.label}
    >
      {button.label}
    </button>
  );
}
