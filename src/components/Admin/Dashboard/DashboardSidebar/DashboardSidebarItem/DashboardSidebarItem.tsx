import { Link } from "react-router-dom";
import type { SidebarItemInterface } from "../DashboardSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DashboardSidebarItem({
  item,
  handleToggle,
}: {
  item: SidebarItemInterface;
  handleToggle?: () => void;
}) {
  return (
    <li key={item.id} onClick={handleToggle}>
      <Link
        className="text-gray-400 font-bold hover:text-gray-100"
        to={item.path ?? "#"}
      >
        <FontAwesomeIcon
          icon={item.icon}
          className="me-2 text-[14px] text-gray-400 font-bold hover:text-gray-100"
        />
        {item.label}
      </Link>
    </li>
  );
}
