import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './Home';
import { describe, it, expect } from 'vitest';

describe('Home Page', () => {
  it('renders the hero section with correct text', () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </HelmetProvider>
    );

    // Verify main heading exists (depending on actual content, assuming generic "Trackify")
    // Note: Adjust the text matchers if the actual heading is different in Home.tsx
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    
    // Verify Get Started link
    const link = screen.getByRole('link', { name: /Get Started/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/signup');
  });
});
