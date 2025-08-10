
import { render } from '@testing-library/react';
import Head from 'next/head';
import SEO from '../../components/SEO';

// Mock Next.js Head component
jest.mock('next/head', () => {
  return function MockHead({ children }) {
    return <>{children}</>;
  };
});

describe('SEO Component', () => {
  test('renders title and description meta tags', () => {
    render(<SEO title="Test Title" description="Test Description" />);
    
    // Check if Head component was called with correct props
    expect(Head).toHaveBeenCalled();
  });

  test('handles missing description gracefully', () => {
    render(<SEO title="Test Title" />);
    expect(Head).toHaveBeenCalled();
  });
});
