
import { getPosts, getPostBySlug } from '../../utils/mdx-utils'
import fs from 'fs'
import path from 'path'

// Mock fs module
jest.mock('fs')
jest.mock('path')

const mockFs = fs
const mockPath = path

describe('mdx-utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPosts', () => {
    it('returns posts array', () => {
      mockFs.readdirSync.mockReturnValue(['post1.mdx', 'post2.mdx', 'not-mdx.txt'])
      mockPath.join.mockImplementation((...args) => args.join('/'))
      mockFs.readFileSync.mockReturnValue(`---
title: Test Post
date: 2024-01-01
description: Test description
---

# Test Content`)

      const posts = getPosts()
      expect(Array.isArray(posts)).toBe(true)
      expect(mockFs.readdirSync).toHaveBeenCalledWith('posts')
    })

    it('filters only mdx files', () => {
      mockFs.readdirSync.mockReturnValue(['post1.mdx', 'post2.md', 'post3.mdx'])
      mockPath.join.mockImplementation((...args) => args.join('/'))
      mockFs.readFileSync.mockReturnValue(`---
title: Test Post
date: 2024-01-01
---

Content`)

      const posts = getPosts()
      expect(mockFs.readFileSync).toHaveBeenCalledTimes(2) // Only .mdx files
    })
  })

  describe('getPostBySlug', () => {
    it('returns post data for valid slug', () => {
      mockPath.join.mockImplementation((...args) => args.join('/'))
      mockFs.readFileSync.mockReturnValue(`---
title: Test Post
date: 2024-01-01
description: Test description
---

# Test Content`)

      const post = getPostBySlug('test-post')
      expect(post).toBeDefined()
      expect(mockFs.readFileSync).toHaveBeenCalledWith('posts/test-post.mdx', 'utf8')
    })

    it('handles missing files gracefully', () => {
      mockPath.join.mockImplementation((...args) => args.join('/'))
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found')
      })

      expect(() => getPostBySlug('non-existent')).toThrow()
    })
  })
})
