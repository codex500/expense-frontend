import React, { useState, useEffect } from 'react';

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
}

export function CustomDatePicker({ value, onChange }: CustomDatePickerProps) {
  const [displayValue, setDisplayValue] = useState('');

  // Setup initial
  useEffect(() => {
    if (value && displayValue === '') {
      const parts = value.split('-');
      if (parts.length === 3) {
        setDisplayValue(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, ''); // digit only
    
    // Auto format DD-MM-YYYY
    if (input.length > 8) input = input.slice(0, 8);
    
    let formatted = input;
    if (input.length > 2) {
      formatted = `${input.slice(0, 2)}-${input.slice(2)}`;
    }
    if (input.length > 4) {
      formatted = `${input.slice(0, 2)}-${input.slice(2, 4)}-${input.slice(4)}`;
    }
    
    setDisplayValue(formatted);

    // Convert back to YYYY-MM-DD if fully valid
    if (input.length === 8) {
      const d = parseInt(input.slice(0, 2));
      const m = parseInt(input.slice(2, 4));
      const y = parseInt(input.slice(4, 8));
      if (d > 0 && d <= 31 && m > 0 && m <= 12 && y > 1900 && y <= new Date().getFullYear()) {
        onChange(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
      }
    } else {
        onChange('');
    }
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder="DD-MM-YYYY"
      className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm transition-all text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary [color-scheme:dark]"
      required
    />
  );
}
