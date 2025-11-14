interface ArticleCardHorizontalProps {
  title: string;
  image: string;
  category: string;
  categoryColor: string;
}

export default function ArticleCardHorizontal({
  title,
  image,
  category,
  categoryColor,
}: ArticleCardHorizontalProps) {
  return (
    <div className="flex-shrink-0 w-80 bg-white rounded-lg shadow-sm overflow-hidden group">
      <img
        alt={title}
        className="w-full h-48 object-cover"
        src={image}
      />
      <div className="p-4">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className={`${categoryColor} font-bold`}>{category}</span>
          <button className="text-gray-500 hover:text-primary">
            <span className="material-symbols-outlined text-lg">ios_share</span>
          </button>
        </div>
        <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
          {title}
        </h4>
      </div>
    </div>
  );
}
