'use client';

import Button from './Button';
import { buttons } from '@/lib/calculate';

interface ButtonGridProps {
  onButton: (value: string) => void;
}

export default function ButtonGrid({ onButton }: ButtonGridProps) {
  return (
    <div className="p-4 grid grid-cols-4 gap-3">
      {buttons.map((btn) => (
        <Button
          key={btn.value + btn.label}
          button={btn}
          onClick={onButton}
        />
      ))}
    </div>
  );
}
