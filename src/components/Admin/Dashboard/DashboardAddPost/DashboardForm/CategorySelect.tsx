export default function CategorySelect() {
  return (
    <div className="bg-white  p-4 rounded-lg shadow-sm border border-slate-200  space-y-4">
      <h3 className="text-base font-semibold">Category</h3>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="language">
          Language
        </label>
        <select
          className="w-full text-sm bg-slate-50  border-slate-300  rounded focus:ring-primary focus:border-primary"
          id="language"
        >
          <option>English</option>
          <option>Arabic</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="category">
          Category
        </label>
        <select
          className="w-full text-sm bg-slate-50  border-slate-300  rounded focus:ring-primary focus:border-primary"
          id="category"
        >
          <option>Select a category</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="subcategory">
          Subcategory
        </label>
        <select
          className="w-full text-sm bg-slate-50  border-slate-300  rounded focus:ring-primary focus:border-primary"
          id="subcategory"
        >
          <option>Select a category</option>
        </select>
      </div>
    </div>
  );
}