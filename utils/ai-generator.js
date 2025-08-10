
import OpenAI from 'openai';
import slugify from 'slugify';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false
});

// Multi-draft writing process with QC
export async function generateEnterpriseArticle(prompt, options = {}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.');
  }

  try {
    // Phase 1: Search Intent Analysis & Content Strategy
    const strategyAnalysis = await analyzeSearchIntent(prompt);
    
    // Phase 2: First Draft Generation
    const firstDraft = await generateFirstDraft(prompt, strategyAnalysis);
    
    // Phase 3: SEO Enhancement & Schema Integration
    const seoEnhanced = await enhanceSEO(firstDraft, strategyAnalysis);
    
    // Phase 4: QC Review & Final Rewrite
    const finalArticle = await qualityControlRewrite(seoEnhanced);
    
    // Phase 5: Generate Structured Data Schema
    const schemaMarkup = await generateSchemaMarkup(finalArticle);

    return {
      ...finalArticle,
      schemaMarkup,
      searchIntent: strategyAnalysis.searchIntent,
      contentStrategy: strategyAnalysis.strategy,
      seoScore: await calculateSEOScore(finalArticle),
      readabilityScore: calculateReadabilityScore(finalArticle.content)
    };

  } catch (error) {
    console.error('Error generating enterprise article:', error);
    throw new Error(`Failed to generate article: ${error.message}`);
  }
}

async function analyzeSearchIntent(prompt) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert SEO strategist and search intent analyst. Analyze the given topic and provide a comprehensive content strategy.

Return a JSON object with:
- searchIntent: The primary search intent (informational, navigational, transactional, commercial)
- primaryKeywords: Array of 3-5 primary keywords
- semanticKeywords: Array of 10-15 related semantic keywords
- competitorTopics: Array of topics competitors might cover
- contentGaps: Opportunities for unique value
- targetAudience: Detailed audience persona
- strategy: Detailed content strategy and approach
- seoFocus: Key SEO elements to emphasize`
      },
      {
        role: "user",
        content: `Analyze search intent and create content strategy for: ${prompt}`
      }
    ],
    temperature: 0.3,
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}

async function generateFirstDraft(prompt, strategy) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert content writer creating the first draft of an enterprise-quality article. Focus on:

1. Comprehensive coverage of the topic
2. Clear structure with logical flow
3. Integration of primary and semantic keywords naturally
4. Addressing the identified search intent
5. Providing unique insights and value
6. Using data, examples, and case studies
7. Creating engaging, scannable content

Return JSON with:
- title: SEO-optimized title (50-60 characters)
- description: Meta description (150-160 characters)
- content: Full article in markdown (3000-4000 words)
- headings: Array of all H2 and H3 headings used
- keywords: Array of keywords integrated
- wordCount: Total word count`
      },
      {
        role: "user",
        content: `Write a comprehensive first draft about: ${prompt}

Use this strategy:
- Search Intent: ${strategy.searchIntent}
- Primary Keywords: ${strategy.primaryKeywords?.join(', ')}
- Target Audience: ${strategy.targetAudience}
- Content Strategy: ${strategy.strategy}`
      }
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}

async function enhanceSEO(draft, strategy) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an SEO specialist optimizing content for search engines and user experience. Enhance the article with:

1. Perfect keyword density and distribution
2. Semantic keyword integration
3. Featured snippet optimization
4. Internal linking opportunities (mark with [INTERNAL_LINK: anchor text])
5. FAQ section addressing People Also Ask queries
6. Meta optimization
7. Content structure for rich snippets

Return JSON with the enhanced version plus:
- seoEnhancements: List of specific improvements made
- targetedQueries: Queries this content could rank for
- internalLinkSuggestions: Suggested internal links
- faqSection: FAQ content for the article`
      },
      {
        role: "user",
        content: `Enhance this article for SEO:

Title: ${draft.title}
Content: ${draft.content}

Target these semantic keywords: ${strategy.semanticKeywords?.join(', ')}`
      }
    ],
    temperature: 0.4,
    max_tokens: 4000,
    response_format: { type: "json_object" }
  });

  const enhanced = JSON.parse(completion.choices[0].message.content);
  return { ...draft, ...enhanced };
}

async function qualityControlRewrite(article) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a senior editor performing final quality control. Review and rewrite to ensure:

1. Enterprise-level quality and professionalism
2. Perfect grammar, spelling, and syntax
3. Consistent tone and voice
4. Logical flow and coherence
5. Factual accuracy and credibility
6. Engaging and valuable content
7. Call-to-action optimization
8. Mobile-friendly formatting

Provide the final, publication-ready version with quality scores.

Return JSON with:
- title: Final optimized title
- description: Final meta description  
- content: Final polished content
- qualityImprovements: List of improvements made
- confidenceScore: Quality confidence (1-100)
- recommendedActions: Any final recommendations`
      },
      {
        role: "user",
        content: `Perform final QC review and rewrite:

Title: ${article.title}
Description: ${article.description}
Content: ${article.content}`
      }
    ],
    temperature: 0.2,
    max_tokens: 4000,
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}

async function generateSchemaMarkup(article) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Generate comprehensive JSON-LD structured data schema for this article. Include:

1. Article schema with author, publisher, date
2. FAQ schema if applicable
3. HowTo schema if applicable
4. BreadcrumbList schema
5. Organization schema

Return valid JSON-LD markup ready for implementation.`
      },
      {
        role: "user",
        content: `Generate schema markup for:
Title: ${article.title}
Content: ${article.content}`
      }
    ],
    temperature: 0.1,
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}

async function calculateSEOScore(article) {
  // Simple SEO scoring algorithm
  let score = 0;
  
  // Title optimization (0-20 points)
  if (article.title && article.title.length >= 50 && article.title.length <= 60) score += 20;
  else if (article.title && article.title.length >= 40) score += 15;
  
  // Meta description (0-20 points)
  if (article.description && article.description.length >= 150 && article.description.length <= 160) score += 20;
  else if (article.description && article.description.length >= 120) score += 15;
  
  // Content length (0-20 points)
  const wordCount = article.content?.split(' ').length || 0;
  if (wordCount >= 2000) score += 20;
  else if (wordCount >= 1000) score += 15;
  else if (wordCount >= 500) score += 10;
  
  // Heading structure (0-20 points)
  const h2Count = (article.content?.match(/## /g) || []).length;
  const h3Count = (article.content?.match(/### /g) || []).length;
  if (h2Count >= 3 && h3Count >= 2) score += 20;
  else if (h2Count >= 2) score += 15;
  
  // Keyword optimization (0-20 points)
  if (article.keywords && article.keywords.length >= 5) score += 20;
  else if (article.keywords && article.keywords.length >= 3) score += 15;
  
  return Math.min(score, 100);
}

function calculateReadabilityScore(content) {
  if (!content) return 0;
  
  const sentences = content.split(/[.!?]+/).length;
  const words = content.split(/\s+/).length;
  const avgWordsPerSentence = words / sentences;
  
  // Simple readability score (Flesch-like)
  let score = 100;
  if (avgWordsPerSentence > 20) score -= 20;
  else if (avgWordsPerSentence > 15) score -= 10;
  
  return Math.max(score, 0);
}

// Legacy function for backward compatibility
export async function generateArticle(prompt) {
  return generateEnterpriseArticle(prompt);
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
          content: "You are a content strategist. Generate creative, SEO-friendly article ideas with search intent analysis. Return a JSON object with an 'ideas' array containing objects with 'title', 'description', 'searchIntent', and 'difficulty' fields."
        },
        {
          role: "user",
          content: `Generate ${count} strategic article ideas for: ${topic}`
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
