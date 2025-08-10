
import { render, screen } from '@testing-library/react'
import Footer from '../../components/Footer'

const mockGlobalData = {
  footerText: 'Made with ❤️'
}

describe('Footer', () => {
  it('renders footer text', () => {
    render(<Footer copyrightText={mockGlobalData.footerText} />)
    expect(screen.getByText('Made with ❤️')).toBeInTheDocument()
  })

  it('renders without copyright text', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('has correct footer structure', () => {
    render(<Footer copyrightText={mockGlobalData.footerText} />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('applies correct CSS classes', () => {
    render(<Footer copyrightText={mockGlobalData.footerText} />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass('py-16')
  })
})
