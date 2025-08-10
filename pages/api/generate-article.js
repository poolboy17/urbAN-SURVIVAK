
import { generateArticle, generateArticleIdeas } from '../../utils/ai-generator';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, type = 'article' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    let result;
    
    if (type === 'ideas') {
      result = await generateArticleIdeas(prompt);
    } else {
      result = await generateArticle(prompt);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
