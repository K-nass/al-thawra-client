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
  faXmark,
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
        path: "/admin/posts/slider-posts",
      },
      {
        id: 9,
        label: "Featured Posts",
        icon: faStar,
        path: "/admin/posts/featured-posts",
      },
      {
        id: 10,
        label: "Breaking News",
        icon: faBolt,
        path: "/admin/posts/breaking-news",
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
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleItem = (itemId: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };
  
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#222E33] text-white rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} className="text-xl" />
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed md:static
          inset-y-0 left-0
          w-20 md:w-64
          p-3 md:p-5 bg-[#222E33] text-slate-300
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          z-40
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-center md:justify-between mb-4 md:mb-6">
          <div className="md:flex md:items-center">
            <span className="text-white text-lg md:text-xl font-bold">A</span>
            <h1 className="hidden md:block text-xl text-white ml-2"><span className="font-bold">Admin</span> Panel</h1>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-white hover:text-gray-300"
            aria-label="Close menu"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="md:block hidden">
          <DashboardProfileCard />
        </div>
        <ul className="flex flex-col gap-1 md:gap-2 mt-3 overflow-y-auto flex-1">
          {sidebarItems.map((item) => {
            const isExpanded = expandedItems.has(item.id);
            return (
              <div key={item.id} className="p-1.5 md:p-2 rounded-xl">
                <div className="flex items-center justify-center md:justify-between relative">
                  <DashboardSidebarItem
                    item={item}
                    handleToggle={
                      item.children ? () => toggleItem(item.id) : undefined
                    }
                  />
                  {item.children && (
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className="hidden md:block text-gray-400 hover:text-gray-100 cursor-pointer ml-auto"
                    >
                      <FontAwesomeIcon
                        icon={isExpanded ? faChevronUp : faChevronDown}
                        className="text-sm"
                      />
                    </button>
                  )}
                </div>
                {item.children && isExpanded && (
                  <ul className="flex flex-col gap-1.5 md:gap-2.5 mt-1 md:mt-5 md:ms-5">
                    {item.children.map((child) => (
                      <div key={child.id} className="rounded-lg transition p-1 md:p-1.5">
                        <DashboardSidebarItem item={child} />
                      </div>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </ul>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
