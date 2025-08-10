
import { useState } from 'react';
import { generateArticle } from '../utils/ai-generator';
import ArticleIdeaGenerator from './ArticleIdeaGenerator';

export default function AIArticleGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const article = await generateArticle(prompt);
      setResult(article);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadMDX = () => {
    if (!result) return;
    
    const mdxContent = `---
title: "${result.title}"
description: "${result.description}"
date: "${new Date().toISOString()}"
---

${result.content}
`;

    const blob = new Blob([mdxContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.slug}.mdx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        AI Article Generator
      </h1>
      
      <div className="mb-8">
        <ArticleIdeaGenerator />
      </div>
      
      <form onSubmit={handleGenerate} className="mb-8">
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Article Topic or Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your article topic, keywords, or detailed prompt..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            rows="4"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
        >
          {loading ? 'Generating...' : 'Generate Article'}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Generated Article</h2>
            <button
              onClick={downloadMDX}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Download MDX
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300">Title:</h3>
              <p className="text-gray-900 dark:text-white">{result.title}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300">Description:</h3>
              <p className="text-gray-900 dark:text-white">{result.description}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300">Slug:</h3>
              <p className="text-gray-900 dark:text-white">{result.slug}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300">Content Preview:</h3>
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white">
                  {result.content.substring(0, 1000)}...
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
