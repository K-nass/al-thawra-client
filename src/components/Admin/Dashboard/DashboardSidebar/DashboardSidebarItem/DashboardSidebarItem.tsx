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
        className="flex items-center text-gray-400 font-bold hover:text-gray-100 transition-colors relative group"
        to={item.path ?? "#"}
        title={item.label}
      >
        <FontAwesomeIcon
          icon={item.icon}
          className="text-lg sm:text-xl text-gray-400 font-bold hover:text-gray-100 flex-shrink-0"
        />
        {/* Label - hidden on small screens, shown on large screens */}
        <span className="ml-2 md:block hidden whitespace-nowrap">
          {item.label}
        </span>
        {/* Tooltip on small screens when hovering over icon */}
        <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 md:hidden">
          {item.label}
        </span>
      </Link>
    </li>
  );
}
