import { Minimize2 } from 'lucide-react';
import { useMiniViewStore } from '~/stores/miniViewStore';

interface MiniViewToggleProps {
  videoSrc: string;
  videoPoster?: string;
  videoTitle: string;
  className?: string;
}

export function MiniViewToggle({
  videoSrc,
  videoPoster,
  videoTitle,
  className = '',
}: MiniViewToggleProps) {
  const { isActive, activate, deactivate } = useMiniViewStore();

  const handleToggle = () => {
    console.log('MiniViewToggle clicked - current isActive:', isActive);
    if (isActive) {
      console.log('Deactivating Mini View');
      deactivate();
    } else {
      console.log('Activating Mini View with data:', { src: videoSrc, poster: videoPoster, title: videoTitle });
      activate({
        src: videoSrc,
        poster: videoPoster,
        title: videoTitle,
      });
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`group relative ${className}`}
      aria-label={isActive ? 'إلغاء العرض المصغر' : 'تفعيل العرض المصغر'}
      title={isActive ? 'إلغاء العرض المصغر' : 'تفعيل العرض المصغر'}
    >
      <Minimize2 
        size={20} 
        className={`transition-colors ${
          isActive 
            ? 'text-[var(--color-primary)]' 
            : 'text-white/80 group-hover:text-white'
        }`}
      />
      
      {/* Tooltip */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {isActive ? 'إلغاء العرض المصغر' : 'وضع العرض المصغر'}
      </span>
    </button>
  );
}
