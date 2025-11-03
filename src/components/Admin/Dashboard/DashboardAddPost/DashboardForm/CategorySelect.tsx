import type { ChangeEvent } from "react";

interface CategoryInterface {
  id: string;
  name: string;
  slug: string;
  colorHex: string;
  description: string;
  isActive: boolean;
  language: string;
  order: number;
  postsCount: number;
  showOnHomepage: boolean;
  showOnMenu: boolean;
  subCategoriesCount: number
}
interface CategorySelectProps {
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, newTags?: string[]) => void,
  categories: CategoryInterface[]
}
export default function CategorySelect({handleChange, categories }: CategorySelectProps) {
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
          name="language"
          onChange={handleChange}
        >
          <option value="English">English</option>
          <option value="Arabic">Arabic</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="category">
          Category
        </label>
        <select
          className="w-full text-sm bg-slate-50  border-slate-300  rounded focus:ring-primary focus:border-primary"
          id="category"
          name="categoryId"
          onChange={handleChange}
        >
          <option selected disabled value="">Select a category</option>
          {categories.map(category =>
            <option key={category.id} value={category.id}>{category.name}</option>
          )}
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