interface FeaturedArticleProps {
  videoImage: string;
  videoTitle: string;
  videoCategory: string;
  title: string;
  category: string;
  description: string;
  date: string;
  sideImage: string;
}

export default function FeaturedArticle({
  videoImage,
  videoTitle,
  videoCategory,
  title,
  category,
  description,
  date,
  sideImage,
}: FeaturedArticleProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Featured Section */}
      <div className="lg:col-span-2 flex flex-col md:flex-row gap-6">
        {/* Video Card */}
        <div className="w-full md:w-1/2 relative overflow-hidden rounded-lg">
          <img
            alt={videoTitle}
            className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            src={videoImage}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-lg"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <button className="bg-black/50 text-white rounded-full w-16 h-16 flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition">
              <span className="material-icons" style={{ fontSize: "40px" }}>
                play_arrow
              </span>
            </button>
          </div>
          <div className="absolute bottom-4 right-4 text-white">
            <div className="bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded-md mb-1 inline-block">
              {videoCategory}
            </div>
            <h3 className="font-bold text-lg leading-tight">{videoTitle}</h3>
          </div>
        </div>

        {/* Article Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <span className="text-primary font-bold text-sm">{category}</span>
          <h1 className="text-3xl font-bold my-2 text-gray-900">
            {title}
          </h1>
          <p className="text-gray-700 leading-relaxed">
            {description}
          </p>
          <span className="text-xs text-gray-600 mt-4">
            {date}
          </span>
        </div>
      </div>

      {/* Side Image */}
      <div className="relative group overflow-hidden rounded-lg">
        <img
          alt="Side featured"
          className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
          src={sideImage}
        />
        <button className="absolute bottom-4 left-4 bg-white/20 text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm hover:bg-white/40 transition">
          <span className="material-icons">share</span>
        </button>
      </div>
    </section>
  );
}
