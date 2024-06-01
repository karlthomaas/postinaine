import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Article } from '@/components/atoms/article';
import type { NewsArticle } from '@/components/atoms/article';

const testArticle: NewsArticle = {
  url: 'https://test.com',
  urlToImage: 'https://test.com/image.jpg',
  title: 'Test Article',
  source: {
    name: 'Test Source',
    id: 'test-source',
  },
  author: 'Test Author',
  description: 'Test Description',
};

describe('Article', () => {
  it('renders correctly with size "sm"', async () => {
    render(<Article size='sm' article={testArticle} />);
    const articleElement = screen.getByRole('link');
    expect(articleElement.getAttribute('href')).toBe(testArticle.url);
    expect(articleElement).toHaveAttribute('target', '_blank');
    
    const imageElement = screen.getByAltText(testArticle.title);
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', testArticle.urlToImage);

    expect(screen.getByText(testArticle.title)).toBeInTheDocument();
    await expect(articleElement).toMatchFileSnapshot('./snapshots/article/article-sm.output.html')
  });

  it('renders correctly with size "md"', async () => {
    render(<Article size='md' article={testArticle} />);
    const articleElement = screen.getByRole('link');
    expect(articleElement.getAttribute('href')).toBe(testArticle.url);
    expect(articleElement).toHaveAttribute('target', '_blank');
    
    const imageElement = screen.getByAltText(testArticle.title);
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', testArticle.urlToImage);

    expect(screen.getByText(testArticle.title)).toBeInTheDocument();
    await expect(articleElement).toMatchFileSnapshot('./snapshots/article/article-md.output.html')
  });

  it('renders correctly with size "lg"', async () => {
    render(<Article size='lg' article={testArticle} />);
    const articleElement = screen.getByRole('link');
    expect(articleElement.getAttribute('href')).toBe(testArticle.url);
    expect(articleElement).toHaveAttribute('target', '_blank');
    
    const imageElement = screen.getByAltText(testArticle.title);
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', testArticle.urlToImage);

    expect(screen.getByText(testArticle.title)).toBeInTheDocument();
    await expect(articleElement).toMatchFileSnapshot('./snapshots/article/article-lg.output.html')
  });
});
