import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface NumberPickerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
}

export function NumberPicker({ value, onChange, min = 0, max = 999, step = 1, label }: NumberPickerProps) {
  const increment = () => {
    if (value + step <= max) {
      onChange(value + step);
    }
  };

  const decrement = () => {
    if (value - step >= min) {
      onChange(value - step);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex flex-col items-center border rounded-lg bg-white shadow-sm">
        <button
          type="button"
          onClick={increment}
          className="p-1 hover:bg-gray-100 rounded-t-lg w-full border-b"
        >
          <ChevronUp className="w-5 h-5 mx-auto text-gray-600" />
        </button>
        <div className="py-2 px-4 text-center min-w-[60px]">
          <span className="text-lg font-medium">{value}</span>
        </div>
        <button
          type="button"
          onClick={decrement}
          className="p-1 hover:bg-gray-100 rounded-b-lg w-full border-t"
        >
          <ChevronDown className="w-5 h-5 mx-auto text-gray-600" />
        </button>
      </div>
    </div>
  );
}