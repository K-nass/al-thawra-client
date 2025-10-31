export default function PostDetailsForm() {
  return (
    <form className="bg-white  p-6 rounded-lg shadow-sm border border-slate-200 ">
      <h3 className="text-lg font-semibold border-b border-slate-200  pb-4 mb-6">
        Post Details
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Title
          </label>
          <input
            className="w-full bg-slate-50  border-slate-300  rounded focus:ring-primary focus:border-primary p-2"
            id="title"
            name="title"
            placeholder="Title"
            type="text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="slug">
            Slug
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            If you leave it blank, it will be generated automatically.
          </p>
          <input
            className="w-full bg-slate-50  border-slate-300  rounded focus:ring-primary focus:border-primary p-2"
            id="slug"
            name="slug"
            placeholder="Slug"
            type="text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="summary">
            Summary &amp; Description (Meta Tag)
          </label>
          <textarea
            className="w-full bg-slate-50  border-slate-300  rounded focus:ring-primary focus:border-primary"
            id="summary"
            name="summary"
            placeholder="Summary &amp; Description (Meta Tag)"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="keywords">
            Keywords (Meta Tag)
          </label>
          <input
            className="w-full bg-slate-50  border-slate-300  rounded focus:ring-primary focus:border-primary p-2"
            id="keywords"
            name="keywords"
            placeholder="Keywords (Meta Tag)"
            type="text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Visibility</label>
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                className="text-primary focus:ring-primary"
                name="visibility"
                type="radio"
              />
              <span className="ml-2">Show</span>
            </label>
            <label className="flex items-center">
              <input
                className="text-primary focus:ring-primary"
                name="visibility"
                type="radio"
              />
              <span className="ml-2">Hide</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Show Right Column
          </label>
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                className="text-primary focus:ring-primary"
                name="right_column"
                type="radio"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                className="text-primary focus:ring-primary"
                name="right_column"
                type="radio"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              className="rounded text-primary focus:ring-primary"
              type="checkbox"
            />
            <span className="ml-2">Add to Slider</span>
          </label>
          <label className="flex items-center">
            <input
              className="rounded text-primary focus:ring-primary"
              type="checkbox"
            />
            <span className="ml-2">Add to Featured</span>
          </label>
          <label className="flex items-center">
            <input
              className="rounded text-primary focus:ring-primary"
              type="checkbox"
            />
            <span className="ml-2">Add to Breaking</span>
          </label>
          <label className="flex items-center">
            <input
              className="rounded text-primary focus:ring-primary"
              type="checkbox"
            />
            <span className="ml-2">Add to Recommended</span>
          </label>
          <label className="flex items-center">
            <input
              className="rounded text-primary focus:ring-primary"
              type="checkbox"
            />
            <span className="ml-2">Show Only to Registered Users</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="tags">
            Tags
          </label>
          <div className="flex items-center">
            <input
              className="grow w-full bg-slate-50  border-slate-300  rounded-l focus:ring-primary focus:border-primary"
              id="tags"
              name="tags"
              placeholder="Type tag and hit enter"
              type="text"
            />
            <button className="px-3 py-2 border border-l-0 border-slate-300  rounded-r bg-slate-100 text-sm hover:bg-slate-200  whitespace-nowrap">
              Manage Tags
            </button>
          </div>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="optional-url"
          >
            Optional URL
          </label>
          <input
            className="w-full bg-slate-50  border-slate-300  rounded focus:ring-primary focus:border-primary"
            id="optional-url"
            name="optional_url"
            placeholder="Optional URL"
            type="text"
          />
        </div>
      </div>
    </form>
  );
}
