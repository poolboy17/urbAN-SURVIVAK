
import { generateArticle, generateIdeas } from '../../utils/ai-generator';

// Mock OpenAI
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'Mocked response' } }]
          })
        }
      }
    }))
  };
});

describe('AI Generator Utils', () => {
  test('generateArticle returns formatted content', async () => {
    const result = await generateArticle('Test topic');
    
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('tags');
  });

  test('generateIdeas returns array of ideas', async () => {
    const result = await generateIdeas('Technology');
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test('handles API errors gracefully', async () => {
    const OpenAI = require('openai').default;
    const mockInstance = new OpenAI();
    mockInstance.chat.completions.create.mockRejectedValueOnce(new Error('API Error'));
    
    await expect(generateArticle('Test')).rejects.toThrow('API Error');
  });
});
