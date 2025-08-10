
import OpenAI from 'openai';
import slugify from 'slugify';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false
});

export async function generateArticle(prompt) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert content writer specializing in creating high-quality, enterprise-level articles. Your writing should be:

1. Professional and authoritative
2. Well-structured with clear headings and subheadings
3. Informative and actionable
4. SEO-optimized with natural keyword integration
5. Engaging and readable
6. Factually accurate and well-researched
7. Include relevant examples and case studies when appropriate
8. Use markdown formatting for headings, lists, links, and emphasis

Please respond with a JSON object containing:
- title: A compelling, SEO-friendly title
- description: A concise meta description (150-160 characters)
- content: The full article content in markdown format (2000-3000 words)
- keywords: An array of relevant SEO keywords

Make sure the content is original, comprehensive, and provides real value to readers.`
        },
        {
          role: "user",
          content: `Write a comprehensive article about: ${prompt}`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    
    // Generate slug from title
    const slug = slugify(result.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });

    return {
      title: result.title,
      description: result.description,
      content: result.content,
      keywords: result.keywords || [],
      slug: slug,
      wordCount: result.content.split(' ').length
    };

  } catch (error) {
    console.error('Error generating article:', error);
    throw new Error(`Failed to generate article: ${error.message}`);
  }
}

export async function generateArticleIdeas(topic, count = 5) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured.');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a content strategist. Generate creative, SEO-friendly article ideas based on the given topic. Return a JSON array of objects with 'title' and 'description' fields."
        },
        {
          role: "user",
          content: `Generate ${count} article ideas related to: ${topic}`
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result.ideas || [];

  } catch (error) {
    console.error('Error generating article ideas:', error);
    throw new Error(`Failed to generate article ideas: ${error.message}`);
  }
}
