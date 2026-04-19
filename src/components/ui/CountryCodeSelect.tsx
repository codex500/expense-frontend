import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { countryCodes } from '@/lib/countryCodes';

interface CountryCodeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function CountryCodeSelect({ value, onChange }: CountryCodeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countryCodes.find(c => c.code === value) || countryCodes[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between h-12 px-4 bg-muted/20 border-r border-input min-w-[90px] text-sm font-medium hover:bg-muted/40 transition-colors focus:outline-none"
      >
        <span className="truncate mr-2 text-foreground">{selectedCountry.code}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-[240px] bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="max-h-[250px] overflow-y-auto p-1 custom-scrollbar">
              {countryCodes.map((c) => (
                <button
                  key={`${c.country}-${c.code}`}
                  onClick={() => {
                    onChange(c.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    value === c.code 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'text-foreground hover:bg-muted font-medium'
                  }`}
                >
                  <span className="truncate">{c.country} ({c.code})</span>
                  {value === c.code && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
