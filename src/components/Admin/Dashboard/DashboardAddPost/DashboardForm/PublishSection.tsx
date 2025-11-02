export default function PublishSection({ mutation }) {
  return (
    <div className="bg-white  p-4 rounded-lg shadow-sm border border-slate-200  space-y-4">
      <h3 className="text-base font-semibold  ">Publish</h3>
      <label className="flex items-center">
        <input
          className="rounded text-primary focus:ring-primary"
          type="checkbox"
        />
        <span className="ml-2 text-sm">Scheduled Post</span>
      </label>
      <div className="flex items-center justify-end space-x-2">
        <button className="px-4 py-2 text-sm  bg-[#DEA530] text-white rounded hover:bg-amber-600 cursor-pointer font-bold">
          Save as Draft
        </button>
        <button className="px-4 py-2 text-sm  bg-primary rounded bg-[#0E7BB8] hover:bg-blue-800 cursor-pointer text-white font-bold" onClick={() => mutation.mutate()}>
          Submit
        </button>
      </div>
    </div>
  );
}
