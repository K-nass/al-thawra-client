import { FileQuestion, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
}

export function EmptyState({ 
  title = "لا توجد بيانات",
  description = "لم نتمكن من العثور على أي محتوى في الوقت الحالي",
  showRefresh = false,
  onRefresh
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon with dashed border */}
      <div className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-black/20 rounded-lg mb-6">
        <FileQuestion className="w-10 h-10 text-gray-400" />
      </div>
      
      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-600 text-center max-w-md mb-6">
        {description}
      </p>
      
      {/* Refresh Button */}
      {showRefresh && onRefresh && (
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-6 py-3 border border-dashed border-black/20 rounded-lg hover:bg-black/5 transition-colors text-gray-700 hover:text-gray-900"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="font-medium">إعادة المحاولة</span>
        </button>
      )}
    </div>
  );
}
