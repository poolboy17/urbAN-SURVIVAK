
import { render, screen } from '@testing-library/react'
import Layout, { GradientBackground } from '../../components/Layout'

describe('Layout', () => {
  it('renders children correctly', () => {
    render(
      <Layout>
        <div>Test content</div>
      </Layout>
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies correct container classes', () => {
    render(
      <Layout>
        <div>Test content</div>
      </Layout>
    )
    const container = screen.getByText('Test content').parentElement
    expect(container).toHaveClass('w-full', 'max-w-3xl', 'px-4', 'md:px-8', 'mx-auto')
  })
})

describe('GradientBackground', () => {
  it('renders gradient background', () => {
    render(<GradientBackground />)
    const gradient = document.querySelector('.gradient-background')
    expect(gradient).toBeInTheDocument()
  })

  it('has correct variant classes for light theme', () => {
    render(<GradientBackground variant="large" />)
    const gradient = document.querySelector('.gradient-background')
    expect(gradient).toHaveClass('opacity-50')
  })

  it('renders with small variant', () => {
    render(<GradientBackground variant="small" />)
    const gradient = document.querySelector('.gradient-background')
    expect(gradient).toBeInTheDocument()
  })
})
