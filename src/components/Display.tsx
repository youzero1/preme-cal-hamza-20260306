'use client';

interface DisplayProps {
  expression: string;
  display: string;
  hasResult: boolean;
  error: string | null;
}

export default function Display({ expression, display, hasResult, error }: DisplayProps) {
  const displayFontSize = display.length > 9
    ? 'text-3xl'
    : display.length > 6
    ? 'text-4xl'
    : 'text-5xl';

  return (
    <div
      className="px-6 pt-8 pb-6 min-h-[160px] flex flex-col justify-end"
      style={{ background: 'linear-gradient(180deg, #0d1b2a 0%, #16213e 100%)' }}
    >
      {/* Expression */}
      <div className="text-right min-h-[28px] mb-2">
        <p className="text-[#8899aa] text-sm font-light tracking-wide truncate">
          {expression && !hasResult
            ? expression
            : hasResult
            ? `${expression} =`
            : '\u00A0'}
        </p>
      </div>

      {/* Main Display */}
      <div className="text-right">
        <span
          className={`font-light tracking-tight transition-all duration-150 ${
            error
              ? 'text-3xl text-[#e94560]'
              : `${displayFontSize} text-white`
          }`}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {display}
        </span>
      </div>
    </div>
  );
}
