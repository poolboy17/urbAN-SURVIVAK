
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';

describe('Footer Component', () => {
  test('renders footer with copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2024/)).toBeInTheDocument();
  });

  test('renders with correct semantic HTML', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });
});
