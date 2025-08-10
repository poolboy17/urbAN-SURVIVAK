
import { render, screen } from '@testing-library/react'
import ArrowIcon from '../../components/ArrowIcon'

describe('ArrowIcon', () => {
  it('renders svg icon', () => {
    render(<ArrowIcon />)
    const svg = screen.getByRole('img', { hidden: true })
    expect(svg).toBeInTheDocument()
  })

  it('has correct viewBox', () => {
    render(<ArrowIcon />)
    const svg = screen.getByRole('img', { hidden: true })
    expect(svg).toHaveAttribute('viewBox', '0 0 12 12')
  })

  it('has aria-hidden attribute', () => {
    render(<ArrowIcon />)
    const svg = screen.getByRole('img', { hidden: true })
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('contains path element', () => {
    render(<ArrowIcon />)
    const path = document.querySelector('path')
    expect(path).toBeInTheDocument()
  })
})
