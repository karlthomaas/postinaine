import type { NewsArticle } from '@/types/news';
import clsx from 'clsx';

interface ArticleProps {
  article?: NewsArticle;
  size: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Article = ({ article, size, isLoading }: ArticleProps) => {
  return (
    <a
      className={clsx(
        `flex h-max min-h-28 border border-neutral-200 bg-white font-medium transition-colors duration-300 ease-in-out
         hover:border-primary sm:rounded-lg  `,
        {
          'col-span-1 flex-row text-sm lg:col-span-2 ': size === 'sm',
          'min-h-[290px] flex-col space-y-3 pb-5': size === 'md',
          'flex-col space-y-4 pb-5 lg:col-span-2 h-full': size === 'lg',
          'duration-2000 animate-pulse bg-neutral-500': isLoading,
        }
      )}
      href={article?.url}
    >
      {!isLoading && article && (
        <>
          <img
            src={article.urlToImage}
            alt={article.title}
            className={clsx('', {
              'size-28 rounded-l-lg object-cover': size === 'sm',
              'rounded-t-lg': size === 'md' || size === 'lg',
            })}
          />
          <h1
            className={clsx('pl-2', {
              'my-auto text-sm': size === 'sm',
              'text-lg': size === 'md',
              'text-xl': size === 'lg',
            })}
          >
            {article.title}
          </h1>
        </>
      )}
    </a>
  );
};
