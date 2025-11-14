import TrendingSection from "./TrendingSection";
import HorizontalScrollSection from "./HorizontalScrollSection";

export interface TrendingArticle {
  id: number;
  title: string;
  date: string;
  image?: string;
  isPortrait?: boolean;
  portraitImage?: string;
}

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

interface HomeContentProps {
  trendingArticles: TrendingArticle[];
  opinionArticles: OpinionArticle[];
}

export default function HomeContent({
  trendingArticles,
  opinionArticles,
}: HomeContentProps) {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Trending */}
        <div className="lg:col-span-1">
          <TrendingSection articles={trendingArticles} />
        </div>
        
        {/* Right column - Horizontal Sections */}
        <div className="lg:col-span-2 space-y-8">
          <HorizontalScrollSection title="كتاب وآراء" articles={opinionArticles} />
        </div>
      </div>
      
      {/* Back to top button */}
      <button className="fixed bottom-8 left-8 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors z-50">
        <span className="material-symbols-outlined">expand_less</span>
      </button>
    </div>
  );
}
