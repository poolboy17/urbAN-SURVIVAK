
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AIArticleGenerator from '../../components/AIArticleGenerator';

// Mock fetch
global.fetch = jest.fn();

describe('AIArticleGenerator Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders form elements', () => {
    render(<AIArticleGenerator />);
    
    expect(screen.getByLabelText(/topic or detailed prompt/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate article/i })).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        content: 'Generated content',
        title: 'Test Title',
        description: 'Test description'
      })
    });

    render(<AIArticleGenerator />);
    
    const input = screen.getByLabelText(/topic or detailed prompt/i);
    const button = screen.getByRole('button', { name: /generate article/i });
    
    fireEvent.change(input, { target: { value: 'Test topic' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/generate-article', expect.any(Object));
    });
  });

  test('displays loading state', async () => {
    fetch.mockImplementationOnce(() => new Promise(() => {})); // Never resolves
    
    render(<AIArticleGenerator />);
    
    const input = screen.getByLabelText(/topic or detailed prompt/i);
    const button = screen.getByRole('button', { name: /generate article/i });
    
    fireEvent.change(input, { target: { value: 'Test topic' } });
    fireEvent.click(button);
    
    expect(screen.getByText(/generating/i)).toBeInTheDocument();
  });
});
