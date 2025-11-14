import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface OpinionCardProps {
  author: string;
  title: string;
  date: string;
  views: number;
  image: string;
  category: string;
  categoryColor: string;
}

export default function OpinionCard({
  author,
  title,
  date,
  views,
  image,
  category,
  categoryColor,
}: OpinionCardProps) {
  return (
    <div className="flex-shrink-0 w-80 bg-white rounded-lg shadow-sm overflow-hidden group">
      <div className="relative h-48 bg-blue-500 flex flex-col items-center justify-center p-4">
        <img
          alt={author}
          className="w-24 h-24 rounded-full border-4 border-white object-cover"
          src={image}
        />
        <h3 className="mt-3 text-white text-lg font-bold">{author}</h3>
        <div className="absolute top-4 left-4 w-8 h-8 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
          <FontAwesomeIcon icon={faChevronRight} className="text-white text-lg" />
        </div>
      </div>
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
        <div className="flex items-center text-xs text-gray-500 mt-2">
          <span>{date}</span>
          <span className="mx-2">|</span>
          <span className="material-symbols-outlined text-sm mr-1">visibility</span>
          <span>{views}</span>
        </div>
      </div>
    </div>
  );
}
