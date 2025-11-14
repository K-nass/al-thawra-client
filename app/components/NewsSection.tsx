import ArticleCard from "./ArticleCard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

interface Article {
  id: string;
  image: string;
  category: string;
  title?: string;
  description?: string;
  isAppPromo?: boolean;
  bgColor?: string;
  flagImage?: string;
}

interface NewsSectionProps {
  title: string;
  articles: Article[];
  showViewMore?: boolean;
}

export default function NewsSection({
  title,
  articles,
  showViewMore = true,
}: NewsSectionProps) {
  return (
    <section className="mb-8">
      {title && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {title}
          </h2>
          {showViewMore && (
            <a
              className="text-xs font-medium text-gray-600 flex items-center gap-1 hover:text-blue-600"
              href="#"
            >
              <span>المزيد</span>
              <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
            </a>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {articles.slice(0, 4).map((article) => (
          <ArticleCard
            key={article.id}
            image={article.image}
            category={article.category}
            title={article.title}
            description={article.description}
            isAppPromo={article.isAppPromo}
            bgColor={article.bgColor}
            flagImage={article.flagImage}
          />
        ))}
      </div>
    </section>
  );
}
