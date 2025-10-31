import Loader from "../../../../Loader/Loader";
import type { CommentInterface, MessageInterface } from "../DashboardHome";
import DataTableHeader from "./DataTableHeader";
import TableRow from "./TableRow";

interface DataTableSectionInterFace {
  label: string;
  description: string;
  cols: string[];
  data: CommentInterface[] | MessageInterface[];
  isLoading:boolean
}

export default function DataTableSection({
  label,
  description,
  cols,
  data,
  isLoading
}: DataTableSectionInterFace) {
  return (
    <div className="bg-white  rounded-lg shadow">
      <DataTableHeader label={label} description={description} />
      <div className="p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#717478]">
              {cols.map((col) => (
                <th className="py-2 px-3 font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={cols.length} className="text-center py-30">
                  <Loader />
                </td>
              </tr>
            ) : (
              data.map((item) => <TableRow key={item.id} item={item} />)
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-200 flex justify-end">
        <button className="text-sm px-4 py-2 rounded-md bg-slate-100  hover:bg-slate-200 cursor-pointer">
          View All
        </button>
      </div>
    </div>
  );
}