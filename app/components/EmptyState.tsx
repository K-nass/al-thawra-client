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
    <div>
      <div>
        <FileQuestion />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {showRefresh && onRefresh && (
        <button
          onClick={onRefresh}
        >
          <RefreshCw />
          <span>إعادة المحاولة</span>
        </button>
      )}
    </div>
  );
}
