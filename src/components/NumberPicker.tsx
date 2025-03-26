import React, { useRef, useEffect, useState } from 'react';

interface NumberPickerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
}

export function NumberPicker({ value, onChange, min = 0, max = 999, step = 1, label }: NumberPickerProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(value);

  const numbers = Array.from({ length: Math.floor((max - min) / step) + 1 }, 
    (_, i) => min + i * step);

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -step : step;
    const newValue = Math.min(max, Math.max(min, value + delta));
    onChange(newValue);
  };

  const handleTouchStart = (e: TouchEvent | MouseEvent) => {
    setIsDragging(true);
    setStartY(e instanceof TouchEvent ? e.touches[0].clientY : e.clientY);
    setStartValue(value);
  };

  const handleTouchMove = (e: TouchEvent | MouseEvent) => {
    if (!isDragging) return;

    const currentY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
    const deltaY = startY - currentY;
    const deltaValue = Math.round(deltaY / 20) * step;
    const newValue = Math.min(max, Math.max(min, startValue + deltaValue));
    
    onChange(newValue);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;

    wheel.addEventListener('wheel', handleWheel, { passive: false });
    wheel.addEventListener('touchstart', handleTouchStart as EventListener);
    wheel.addEventListener('mousedown', handleTouchStart as EventListener);
    window.addEventListener('touchmove', handleTouchMove as EventListener);
    window.addEventListener('mousemove', handleTouchMove as EventListener);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mouseup', handleTouchEnd);

    return () => {
      wheel.removeEventListener('wheel', handleWheel);
      wheel.removeEventListener('touchstart', handleTouchStart as EventListener);
      wheel.removeEventListener('mousedown', handleTouchStart as EventListener);
      window.removeEventListener('touchmove', handleTouchMove as EventListener);
      window.removeEventListener('mousemove', handleTouchMove as EventListener);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mouseup', handleTouchEnd);
    };
  }, [isDragging, startY, startValue, min, max, step, onChange]);

  const getVisibleNumbers = () => {
    const currentIndex = numbers.indexOf(value);
    const visibleCount = 5;
    const halfVisible = Math.floor(visibleCount / 2);
    
    let start = currentIndex - halfVisible;
    let end = currentIndex + halfVisible;

    if (start < 0) {
      end = Math.min(numbers.length - 1, end - start);
      start = 0;
    }

    if (end >= numbers.length) {
      start = Math.max(0, start - (end - numbers.length + 1));
      end = numbers.length - 1;
    }

    return numbers.slice(start, end + 1);
  };

  return (
    <div className="flex flex-col items-center select-none">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div 
        ref={wheelRef}
        className="relative h-[120px] overflow-hidden rounded-lg bg-white shadow-sm border w-20"
        style={{ touchAction: 'none' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-10 -mt-5 bg-blue-50/50 border-y border-blue-100" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center py-[40px]">
          {getVisibleNumbers().map((num, index) => (
            <div
              key={num}
              className={`h-10 flex items-center justify-center transition-all duration-150 ${
                num === value 
                  ? 'text-lg font-semibold text-blue-600' 
                  : 'text-base text-gray-400'
              }`}
              style={{
                transform: `scale(${num === value ? 1 : 0.8})`,
              }}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}