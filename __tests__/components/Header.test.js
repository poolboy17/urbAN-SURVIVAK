
import { render, screen } from '@testing-library/react';
import Header from '../../components/Header';

describe('Header Component', () => {
  test('renders header with name', () => {
    render(<Header name="Test Blog" />);
    expect(screen.getByText('Test Blog')).toBeInTheDocument();
  });

  test('renders navigation link to generate page', () => {
    render(<Header name="Test Blog" />);
    const generateLink = screen.getByText('Generate Article');
    expect(generateLink).toBeInTheDocument();
    expect(generateLink.closest('a')).toHaveAttribute('href', '/generate');
  });

  test('applies correct CSS classes', () => {
    render(<Header name="Test Blog" />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('pt-16', 'pb-12');
  });
});
