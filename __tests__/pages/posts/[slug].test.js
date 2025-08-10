
import { render, screen } from '@testing-library/react'
import PostPage from '../../../pages/posts/[slug]'

// Mock MDX components
jest.mock('next-mdx-remote', () => ({
  MDXRemote: ({ source, components }) => {
    return <div data-testid="mdx-content">{source}</div>
  }
}))

const mockProps = {
  source: 'Test MDX content',
  frontMatter: {
    title: 'Test Post',
    description: 'Test description',
    date: '2024-01-01'
  },
  globalData: {
    name: 'Test Blog',
    blogTitle: 'Test Blog Title',
    footerText: 'Test Footer'
  }
}

describe('Post page', () => {
  it('renders post title', () => {
    render(<PostPage {...mockProps} />)
    expect(screen.getByText('Test Post')).toBeInTheDocument()
  })

  it('renders post date', () => {
    render(<PostPage {...mockProps} />)
    expect(screen.getByText('2024-01-01')).toBeInTheDocument()
  })

  it('renders MDX content', () => {
    render(<PostPage {...mockProps} />)
    expect(screen.getByTestId('mdx-content')).toBeInTheDocument()
  })

  it('renders back to home link', () => {
    render(<PostPage {...mockProps} />)
    const backLink = screen.getByRole('link', { name: /back to home/i })
    expect(backLink).toHaveAttribute('href', '/')
  })

  it('has correct meta description', () => {
    render(<PostPage {...mockProps} />)
    // SEO component should render meta description
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', 'Test description')
  })
})
