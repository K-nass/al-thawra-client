import type { TrendingArticle } from "./HomeContent";

interface TrendingSectionProps {
  articles: TrendingArticle[];
}

export default function TrendingSection({ articles }: TrendingSectionProps) {
  return (
    <div className="lg:col-span-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Trending</h2>
        <div className="flex items-center space-x-4 space-x-reverse text-sm font-medium">
          <button className="text-gray-500 hover:text-primary">شهري</button>
          <button className="text-gray-500 hover:text-primary">أسبوعي</button>
          <button className="text-primary border-b-2 border-primary pb-1">يومي</button>
        </div>
      </div>
      <div className="space-y-4">
        {articles.map((article) => (
          <a
            key={article.id}
            className="flex items-center space-x-4 space-x-reverse bg-transparent group"
            href="#"
          >
            <div className="flex-shrink-0 relative">
              {article.isPortrait ? (
                <div className="w-20 h-20 bg-blue-400 rounded-lg flex items-center justify-center">
                  <img
                    alt={article.title}
                    className="w-10 h-10 rounded-full border-2 border-white"
                    src={article.portraitImage}
                  />
                </div>
              ) : (
                <img
                  alt={article.title}
                  className="w-20 h-20 object-cover rounded-lg"
                  src={article.image}
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-bold">
                {article.id}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base group-hover:text-primary transition-colors text-gray-900">
                {article.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{article.date}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
