import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenderSelect } from './GenderSelect';
import { describe, it, expect, vi } from 'vitest';

describe('GenderSelect', () => {
  it('renders default state', () => {
    const handleChange = vi.fn();
    render(<GenderSelect value="" onChange={handleChange} />);
    expect(screen.getByText('Select Gender')).toBeInTheDocument();
  });

  it('renders selected value', () => {
    const handleChange = vi.fn();
    render(<GenderSelect value="female" onChange={handleChange} />);
    expect(screen.getByText('Female')).toBeInTheDocument();
  });

  it('opens dropdown on click and calls onChange when selecting an option', () => {
    const handleChange = vi.fn();
    render(<GenderSelect value="" onChange={handleChange} />);
    
    // Dropdown options should not be visible initially
    expect(screen.queryByText('Male')).not.toBeInTheDocument();

    // Click the button to open the dropdown
    const button = screen.getByRole('button', { name: /Select Gender/i });
    fireEvent.click(button);

    // Now options should be visible
    const maleOption = screen.getByText('Male');
    expect(maleOption).toBeInTheDocument();

    // Click an option
    fireEvent.click(maleOption);

    // Should call onChange with 'male'
    expect(handleChange).toHaveBeenCalledWith('male');
  });
});
