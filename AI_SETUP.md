
# AI Article Generator Setup

This AI article generator uses OpenAI's GPT-4 API to create enterprise-quality content for your blog.

## Prerequisites

1. **OpenAI API Key**: You need an OpenAI API account and key
2. **Replit Secrets**: Store your API key securely

## Setup Instructions

### 1. Get OpenAI API Key

1. Visit [OpenAI API Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

### 2. Add API Key to Replit Secrets

1. In your Replit workspace, click on the "Secrets" tab (lock icon)
2. Add a new secret:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key

### 3. Usage

1. Navigate to `/generate` in your blog
2. Enter a topic or detailed prompt
3. Click "Generate Article"
4. Download the generated MDX file
5. Place it in your `/posts` directory

## Features

- **Enterprise Quality**: Generates professional, well-structured content
- **SEO Optimized**: Includes meta descriptions and keywords
- **MDX Compatible**: Ready-to-use MDX format with frontmatter
- **Idea Generator**: Get article ideas for any topic
- **Customizable**: Modify prompts and parameters as needed

## API Costs

- GPT-4: ~$0.03-0.06 per 1K tokens
- Average article (~3K words): ~$0.20-0.50
- Monitor usage in OpenAI dashboard

## Security

- API keys are stored securely in Replit Secrets
- Never expose API keys in code
- API calls are made server-side only

## Customization

Edit `utils/ai-generator.js` to:
- Change AI model parameters
- Modify content structure
- Add custom prompts
- Adjust content length
