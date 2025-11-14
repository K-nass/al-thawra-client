import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

interface SectionHeaderProps {
  leftLink: {
    text: string;
    href: string;
  };
  rightText: string;
}

export default function SectionHeader({ leftLink, rightText }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
      <h2 className="text-xl font-bold text-gray-900">{rightText}</h2>
      <a
        className="flex items-center space-x-1 space-x-reverse text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        href={leftLink.href}
      >
        <span>{leftLink.text}</span>
        <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
      </a>
    </div>
  );
}
