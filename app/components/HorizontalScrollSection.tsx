import OpinionCard from "./OpinionCard";
import ArticleCardHorizontal from "./ArticleCardHorizontal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

interface OpinionArticle {
  type: "opinion";
  author: string;
  title: string;
  date: string;
  views: number;
  image: string;
  category: string;
  categoryColor: string;
}

interface StandardArticle {
  type: "standard";
  title: string;
  image: string;
  category: string;
  categoryColor: string;
}

type Article = OpinionArticle | StandardArticle;

interface HorizontalScrollSectionProps {
  title: string;
  articles: Article[];
}

export default function HorizontalScrollSection({
  title,
  articles,
}: HorizontalScrollSectionProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <a
          className="flex items-center space-x-2 space-x-reverse text-xl font-bold text-gray-900 hover:text-primary transition-colors"
          href="#"
        >
          <span>{title}</span>
          <FontAwesomeIcon icon={faChevronLeft} className="text-base" />
        </a>
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto space-x-6 space-x-reverse pb-4 hide-scrollbar">
          {articles.map((article, index) => {
            if (article.type === "opinion") {
              return (
                <OpinionCard
                  key={index}
                  author={article.author}
                  title={article.title}
                  date={article.date}
                  views={article.views}
                  image={article.image}
                  category={article.category}
                  categoryColor={article.categoryColor}
                />
              );
            } else {
              return (
                <ArticleCardHorizontal
                  key={index}
                  title={article.title}
                  image={article.image}
                  category={article.category}
                  categoryColor={article.categoryColor}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
