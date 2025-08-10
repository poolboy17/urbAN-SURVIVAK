
import { render, screen } from '@testing-library/react'
import Header from '../../components/Header'

const mockGlobalData = {
  name: 'Test Blog',
  blogTitle: 'Test Blog Title',
  footerText: 'Footer text'
}

describe('Header', () => {
  it('renders blog name', () => {
    render(<Header name={mockGlobalData.name} />)
    expect(screen.getByText('Test Blog')).toBeInTheDocument()
  })

  it('renders without name prop', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('has correct link structure', () => {
    render(<Header name={mockGlobalData.name} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/')
  })

  it('applies correct CSS classes', () => {
    render(<Header name={mockGlobalData.name} />)
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('pt-16', 'pb-12')
  })
})
