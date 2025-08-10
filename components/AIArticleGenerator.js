
import { useState } from 'react';
import { generateEnterpriseArticle } from '../utils/ai-generator';
import ArticleIdeaGenerator from './ArticleIdeaGenerator';
import FeatureImage from './FeatureImage';

export default function AIArticleGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [generationPhase, setGenerationPhase] = useState('');
  const [featureImage, setFeatureImage] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Simulate phases for user feedback
      setGenerationPhase('Analyzing search intent...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGenerationPhase('Generating first draft...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setGenerationPhase('Optimizing for SEO...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGenerationPhase('Quality control review...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGenerationPhase('Finalizing article...');
      
      const article = await generateEnterpriseArticle(prompt);
      setResult(article);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setGenerationPhase('');
    }
  };

  const downloadMDX = () => {
    if (!result) return;
    
    const mdxContent = `---
title: "${result.title}"
description: "${result.description}"
date: "${new Date().toISOString()}"
keywords: ${JSON.stringify(result.keywords || [])}
searchIntent: "${result.searchIntent || 'informational'}"
seoScore: ${result.seoScore || 0}
readabilityScore: ${result.readabilityScore || 0}
featureImage: "${featureImage?.url || ''}"
featureImageAlt: "${featureImage?.description || result.title}"
featureImageCredit: "${featureImage?.author || ''}"
featureImageCreditUrl: "${featureImage?.authorUrl || ''}"
---

${result.content}

${result.faqSection ? '\n## Frequently Asked Questions\n\n' + result.faqSection : ''}

<script type="application/ld+json">
${JSON.stringify(result.schemaMarkup, null, 2)}
</script>
`;

    const blob = new Blob([mdxContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.slug || 'article'}.mdx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Enterprise AI Article Generator
      </h1>
      
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div>
          <ArticleIdeaGenerator />
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">
            Enterprise Features
          </h2>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>✅ Multi-draft writing process</li>
            <li>✅ Search intent analysis</li>
            <li>✅ Advanced SEO optimization</li>
            <li>✅ Schema markup generation</li>
            <li>✅ Quality control review</li>
            <li>✅ Readability scoring</li>
            <li>✅ FAQ section generation</li>
            <li>✅ Internal linking suggestions</li>
          </ul>
        </div>
      </div>
      
      <form onSubmit={handleGenerate} className="mb-8">
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Article Topic or Detailed Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your article topic, target audience, key points to cover, or detailed content brief..."
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            rows="6"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
        >
          {loading ? 'Generating Enterprise Article...' : 'Generate Enterprise Article'}
        </button>
        
        {loading && generationPhase && (
          <p className="mt-4 text-blue-600 dark:text-blue-400 font-medium">
            {generationPhase}
          </p>
        )}
      </form>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generated Enterprise Article</h2>
            <button
              onClick={downloadMDX}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Download MDX
            </button>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Feature Image:</h3>
            <FeatureImage
              query={result.title}
              width={600}
              height={300}
              alt={result.title}
              className="w-full max-w-2xl"
              onImageSelect={setFeatureImage}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Title:</h3>
                <p className="text-gray-900 dark:text-white font-medium">{result.title}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Meta Description:</h3>
                <p className="text-gray-900 dark:text-white text-sm">{result.description}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Search Intent:</h3>
                <span className="inline-block bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                  {result.searchIntent}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Quality Metrics:</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>SEO Score:</span>
                    <span className={`font-bold ${getScoreColor(result.seoScore)}`}>
                      {result.seoScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Readability:</span>
                    <span className={`font-bold ${getScoreColor(result.readabilityScore)}`}>
                      {result.readabilityScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Word Count:</span>
                    <span className="font-bold">{result.wordCount || 0}</span>
                  </div>
                </div>
              </div>
              
              {result.keywords && (
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Keywords:</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.keywords.map((keyword, index) => (
                      <span key={index} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Content Preview:</h3>
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white">
                  {result.content?.substring(0, 2000)}...
                </pre>
              </div>
            </div>
            
            {result.qualityImprovements && (
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Quality Improvements:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {result.qualityImprovements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
