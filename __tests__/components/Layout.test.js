
import { render, screen } from '@testing-library/react';
import Layout from '../../components/Layout';

describe('Layout Component', () => {
  test('renders children content', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('applies correct CSS classes to main element', () => {
    render(<Layout><div>Test</div></Layout>);
    const main = screen.getByRole('main');
    expect(main).toHaveClass('w-full');
  });
});
