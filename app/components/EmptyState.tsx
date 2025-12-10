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
      <div className="w-20 h-20 bg-[var(--color-background-light)] rounded-full flex items-center justify-center mb-4">
        <FileQuestion className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">{description}</p>
      {showRefresh && onRefresh && (
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium"
        >
          <RefreshCw className="w-5 h-5" />
          <span>إعادة المحاولة</span>
        </button>
      )}
    </div>
  );
}
