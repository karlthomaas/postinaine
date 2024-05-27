export interface NewsQueryResponse {
    status: string;
    totalResults: number;
    articles: NewsArticle[];
}

export interface NewsQueryError {
    status: string;
    code: string;
    message: string;
}

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
