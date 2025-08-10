
import handler from '../../../pages/api/generate-article';
import { createMocks } from 'node-mocks-http';

// Mock the AI generator
jest.mock('../../../utils/ai-generator', () => ({
  generateArticle: jest.fn().mockResolvedValue({
    title: 'Test Title',
    description: 'Test Description',
    content: 'Test Content',
    tags: ['test']
  })
}));

describe('/api/generate-article API endpoint', () => {
  test('handles POST request successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { prompt: 'Test topic' }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('content');
  });

  test('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET'
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  test('returns 400 for missing prompt', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {}
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });
});
