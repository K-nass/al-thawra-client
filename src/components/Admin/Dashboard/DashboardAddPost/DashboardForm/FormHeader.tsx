export default function FormHeader({ type }: { type: string | null }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
      <h2 className="text-xl sm:text-2xl font-bold">Add {type}</h2>
      <button 
        type="button"
        className="flex items-center space-x-2 px-3 py-1.5 text-sm border border-slate-300 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 w-full sm:w-auto"
      >
        <span className="material-icons-sharp text-base">article</span>
        <span>Posts</span>
      </button>
    </div>
  );
}
