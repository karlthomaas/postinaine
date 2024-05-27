import { useNewsQuery } from '@/features/apiActions';
import { Article } from '@/components/atoms/article';
import { useMemo } from 'react';

export default function NewsPage() {
  const { data, isLoading } = useNewsQuery(null);

  const loadingArticles = Array.from({ length: 14 }).map((_, index) => (
    <Article size={index < 2 ? 'lg' : index < 6 ? 'md' : 'sm'} isLoading={true} key={index} />
  ));

  const articles = useMemo(() =>
    data?.articles
      .filter((article) => article.urlToImage)
      .map((article, index) => <Article size={index < 2 ? 'lg' : index < 6 ? 'md' : 'sm'} article={article} key={index} />)
  , [data]);

  return (
    <div className='my-6'>
      <div className='sm:gap-15 grid grid-cols-1 gap-10 sm:px-10 md:px-20 lg:grid-cols-4 lg:px-0'>
        {isLoading ? loadingArticles : articles}
      </div>
    </div>
  );
}
