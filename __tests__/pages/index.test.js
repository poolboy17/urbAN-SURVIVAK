
import { render, screen } from '@testing-library/react'
import Home from '../../pages/index'

// Mock the utils
jest.mock('../../utils/mdx-utils', () => ({
  getPosts: jest.fn(() => [
    {
      slug: 'test-post-1',
      title: 'Test Post 1',
      description: 'Test description 1',
      date: '2024-01-01'
    },
    {
      slug: 'test-post-2',
      title: 'Test Post 2',
      description: 'Test description 2',
      date: '2024-01-02'
    }
  ])
}))

jest.mock('../../utils/global-data', () => ({
  getGlobalData: jest.fn(() => ({
    name: 'Test Blog',
    blogTitle: 'Test Blog Title',
    footerText: 'Test Footer'
  }))
}))

const mockProps = {
  posts: [
    {
      slug: 'test-post-1',
      title: 'Test Post 1',
      description: 'Test description 1',
      date: '2024-01-01'
    }
  ],
  globalData: {
    name: 'Test Blog',
    blogTitle: 'Test Blog Title',
    footerText: 'Test Footer'
  }
}

describe('Home page', () => {
  it('renders blog title', () => {
    render(<Home {...mockProps} />)
    expect(screen.getByText('Test Blog Title')).toBeInTheDocument()
  })

  it('renders post titles', () => {
    render(<Home {...mockProps} />)
    expect(screen.getByText('Test Post 1')).toBeInTheDocument()
  })

  it('renders post links', () => {
    render(<Home {...mockProps} />)
    const postLink = screen.getByRole('link', { name: /test post 1/i })
    expect(postLink).toHaveAttribute('href', '/posts/test-post-1')
  })

  it('renders without posts', () => {
    const emptyProps = { ...mockProps, posts: [] }
    render(<Home {...emptyProps} />)
    expect(screen.getByText('Test Blog Title')).toBeInTheDocument()
  })

  it('has correct page structure', () => {
    render(<Home {...mockProps} />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
