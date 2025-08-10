
import { render } from '@testing-library/react'
import Head from 'next/head'
import SEO from '../../components/SEO'

// Mock Next.js Head component
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => {
      return <>{children}</>
    },
  }
})

describe('SEO', () => {
  it('renders with title', () => {
    render(<SEO title="Test Title" />)
    expect(document.title).toBe('Test Title')
  })

  it('renders with description', () => {
    render(<SEO description="Test description" />)
    const metaDescription = document.querySelector('meta[name="description"]')
    expect(metaDescription).toHaveAttribute('content', 'Test description')
  })

  it('renders without props', () => {
    render(<SEO />)
    // Should not throw error
    expect(document.head).toBeInTheDocument()
  })

  it('sets viewport meta tag', () => {
    render(<SEO />)
    const viewport = document.querySelector('meta[name="viewport"]')
    expect(viewport).toHaveAttribute('content', 'width=device-width, initial-scale=1')
  })
})
