
import { render, screen } from '@testing-library/react'
import CustomLink from '../../components/CustomLink'

describe('CustomLink', () => {
  it('renders internal link with Next.js Link', () => {
    render(<CustomLink href="/test">Internal Link</CustomLink>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/test')
    expect(screen.getByText('Internal Link')).toBeInTheDocument()
  })

  it('renders external link with target blank', () => {
    render(<CustomLink href="https://example.com">External Link</CustomLink>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders email link correctly', () => {
    render(<CustomLink href="mailto:test@example.com">Email Link</CustomLink>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'mailto:test@example.com')
  })

  it('handles anchor links', () => {
    render(<CustomLink href="#section">Anchor Link</CustomLink>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '#section')
  })

  it('passes through additional props', () => {
    render(<CustomLink href="/test" className="custom-class">Link</CustomLink>)
    const link = screen.getByRole('link')
    expect(link).toHaveClass('custom-class')
  })
})
