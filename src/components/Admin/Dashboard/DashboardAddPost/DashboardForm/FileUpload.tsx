export default function FileUpload() {
  return (
    <div className="bg-white  p-4 rounded-lg shadow-sm border border-slate-200  space-y-3">
      <h3 className="text-base font-semibold  ">Files</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 -mt-2">
        Downloadable additional files (.pdf,.docx,.zip etc..)
      </p>
      <button className="w-full text-sm px-3 py-2 bg-[#605CA8] text-white rounded hover:bg-indigo-700 cursor-pointer">
        Select File
      </button>
    </div>
  );
}
