import clsx from 'clsx';

export interface NewsArticle {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
}

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
         hover:border-primary sm:rounded-lg`,
        {
          'col-span-1 flex-row text-sm lg:col-span-2 ': size === 'sm',
          'min-h-[290px] flex-col space-y-3 pb-5': size === 'md',
          'h-full flex-col space-y-4 pb-5 lg:col-span-2': size === 'lg',
          'animate-pulse bg-neutral-500 duration-2000 hover:border-none': isLoading,
        }
      )}
      href={article?.url}
      target='_blank'
    >
      {!isLoading && article && (
        <>
          <img
            src={article.urlToImage}
            alt={article.title}
            className={clsx('', {
              'size-28 rounded-l-lg object-cover': size === 'sm',
              'rounded-t-lg': size === 'md',
              'rounded-t-lg lg:h-[270px] lg:object-cover': size === 'lg',
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
