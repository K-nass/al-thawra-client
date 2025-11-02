import {
  faHouse,
  faTh,
  faLeaf,
  faFileText,
  faFile,
  faCloudUpload,
  faBars,
  faRss,
  faStar,
  faBolt,
  faThumbsUp,
  faClock,
  faCalendar,
  faListCheck,
  faLayerGroup,
  faTag,
  faChevronDown,
  faChevronUp,
  type IconDefinition,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";

import DashboardProfileCard from "./DashboardProfileCard/DashboardProfileCard";
import DashboardSidebarItem from "./DashboardSidebarItem/DashboardSidebarItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export interface SidebarItemInterface {
  id: number;
  label: string;
  icon: IconDefinition;
  path?: string;
  children?: SidebarItemInterface[];
}

const sidebarItems: SidebarItemInterface[] = [
  { id: 0, label: "Home", icon: faHouse, path: "" },
  {
    id: 1,
    label: "Navigation",
    icon: faTh,
    path: "/admin/navigation",
  },
  { id: 2, label: "Themes", icon: faLeaf, path: "/admin/themes" },
  { id: 3, label: "Pages", icon: faFileText, path: "/admin/pages" },
  {
    id: 4,
    label: "Add Post",
    icon: faFile,
    path: "/admin/post-format",
  },
  {
    id: 5,
    label: "Bulk Post Upload",
    icon: faCloudUpload,
    path: "/admin/bulk-upload",
  },
  {
    id: 6,
    label: "Posts",
    icon: faBars,
    children: [
      {
        id: 7,
        label: "All Posts",
        icon: faFileAlt,
        path: "/admin/posts/all",
      },
      {
        id: 8,
        label: "Slider Posts",
        icon: faRss,
        path: "/admin/posts/slider",
      },
      {
        id: 9,
        label: "Featured Posts",
        icon: faStar,
        path: "/admin/posts/featured",
      },
      {
        id: 10,
        label: "Breaking News",
        icon: faBolt,
        path: "/admin/posts/breaking-news",
      },
      {
        id: 11,
        label: "Recommended Posts",
        icon: faThumbsUp,
        path: "/admin/posts/recommended",
      },
      {
        id: 12,
        label: "Pending Posts",
        icon: faClock,
        path: "/admin/posts/pending",
      },
      {
        id: 13,
        label: "Scheduled Posts",
        icon: faCalendar,
        path: "/admin/posts/scheduled",
      },
      {
        id: 14,
        label: "Drafts",
        icon: faListCheck,
        path: "/admin/posts/drafts",
      },
    ],
  },
  {
    id: 15,
    label: "Categories",
    icon: faLayerGroup,
    path: "/admin/categories",
  },
  { id: 16, label: "Tags", icon: faTag, path: "/admin/tags" },
];

export default function DashboardSidebar() {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="w-1/6 p-5 bg-[#222E33] text-slate-300 flex flex-col">
      <h1 className="text-xl text-white"><span className="font-bold">Admin</span> Panel</h1>
      <DashboardProfileCard />
      <ul className="flex flex-col gap-2 mt-3">
        {sidebarItems.map((item) => (
          <div key={item.id} className="p-2 rounded-xl">
            <div className="flex items-center justify-between ">
              <DashboardSidebarItem
                item={item}
                handleToggle={
                  item.children ? () => setIsVisible(!isVisible) : undefined
                }
              />
              {item.children && (
                <FontAwesomeIcon
                  icon={isVisible ? faChevronUp : faChevronDown}
                  className="text-gray-400 font-bold cursor-pointer"
                  onClick={() => setIsVisible(!isVisible)}
                />
              )}
            </div>
            {item.children && (
              <ul className="flex flex-col gap-2.5 mt-2 ms-5">
                {item.children.map(
                  (child) =>
                    isVisible && (
                      <div className="rounded-lg transition p-1.5">
                        <DashboardSidebarItem key={child.id} item={child} />
                      </div>
                    )
                )}
              </ul>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}
