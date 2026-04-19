import React, { useState } from 'react';

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function CustomDatePicker({ value, onChange }: CustomDatePickerProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Converts native "YYYY-MM-DD" to "DD-MM-YYYY" specifically for presentation when unfocused
  const displayValue = () => {
    if (!value) return '';
    try {
      const parts = value.split('-');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    } catch {
      // ignore
    }
    return value;
  };

  return (
    <input
      type={isFocused ? 'date' : 'text'}
      value={isFocused ? value : displayValue()}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      max={new Date().toISOString().split('T')[0]}
      placeholder="DD-MM-YYYY"
      className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm transition-all text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary [color-scheme:dark]"
      required
    />
  );
}
