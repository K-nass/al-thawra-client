interface ArticleCardProps {
  image: string;
  category: string;
  title?: string;
  description?: string;
  isAppPromo?: boolean;
  bgColor?: string;
  flagImage?: string;
}

export default function ArticleCard({
  image,
  category,
  title,
  description,
  isAppPromo = false,
  bgColor = "bg-green-500",
  flagImage,
}: ArticleCardProps) {
  if (isAppPromo) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
        <div className="relative overflow-hidden">
          <img
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
            src={image}
          />
        </div>
        <div className={`p-4 flex flex-col flex-grow ${bgColor}`}>
          <h3 className="font-bold text-white flex-grow text-sm">{description}</h3>
          <div className="flex justify-between items-center mt-3 text-white">
            <a className="text-xs font-bold" href="#">
              حمل التطبيق
            </a>
            <span className="material-icons text-sm">arrow_forward</span>
          </div>
        </div>
      </div>
    );
  }

  if (bgColor === "bg-blue-400") {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
        <div className="relative bg-blue-400 flex-grow p-4 flex items-center justify-center overflow-hidden">
          <img
            alt={title}
            className="w-32 h-32 object-cover border-4 border-white shadow-lg rounded transition-transform duration-300 hover:scale-110"
            src={image}
          />
        </div>
        <div className="p-3 flex justify-between items-center">
          <span className="text-blue-600 text-xs font-bold">{category}</span>
          <button className="text-gray-400 hover:text-blue-600">
            <span className="material-icons text-sm">share</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="relative overflow-hidden">
        <img
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
          src={image}
        />
        {flagImage && (
          <img
            alt="Country flag"
            className="absolute top-2 right-2 w-8 h-8 rounded-full border-2 border-white shadow-sm"
            src={flagImage}
          />
        )}
        {title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <h3 className="text-white font-bold text-sm leading-tight">{title}</h3>
          </div>
        )}
      </div>
      <div className="p-3 flex justify-between items-center">
        <span className="text-blue-600 text-xs font-bold">{category}</span>
        <button className="text-gray-400 hover:text-blue-600">
          <span className="material-icons text-sm">share</span>
        </button>
      </div>
    </div>
  );
}
