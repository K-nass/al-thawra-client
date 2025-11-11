import type { UseMutationResult } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface PublishSectionProps {
  mutation: UseMutationResult<unknown, unknown, void, unknown>;
  isEditMode?: boolean;
}

export default function PublishSection({ mutation: _mutation, isEditMode = false }: PublishSectionProps) {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-slate-200 space-y-3 sm:space-y-4">
      <h3 className="text-sm sm:text-base font-semibold">{t('post.publish')}</h3>
      <label className="flex items-center">
        <input
          className="rounded text-primary focus:ring-primary"
          type="checkbox"
        />
        <span className="ml-2 text-xs sm:text-sm">{t('post.scheduledPost')}</span>
      </label>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:space-x-2">
        <button 
          type="button"
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#DEA530] text-white rounded hover:bg-amber-600 cursor-pointer"
        >
          {t('post.saveAsDraft')}
        </button>
        <button 
          type="submit"
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-primary bg-[#605CA8] rounded hover:bg-indigo-700 cursor-pointer text-white"
        >
          {isEditMode ? t('post.updatePost', 'Update Post') : t('post.publishPost')}
        </button>
      </div>
    </div>
  );
}
