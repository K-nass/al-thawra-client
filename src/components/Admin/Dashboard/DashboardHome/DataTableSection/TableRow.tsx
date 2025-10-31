import type { CommentInterface, MessageInterface } from "../DashboardHome";

export default function TableRow({
  item,
}: {
  item: CommentInterface | MessageInterface;
}) {
   const content = "comment" in item ? item.comment : item.message;
  return (
    <tr key={item.id} className="border-t border-slate-200">
      <td className="py-3 px-3">{item.id}</td>
      <td className="py-3 px-3">{item.name}</td>
      <td className="py-3 px-3">{content}</td>
      <td className="py-3 px-3 whitespace-nowrap">{item.date}</td>
    </tr>
  );
}
