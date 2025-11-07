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
  faSignOutAlt,
  type IconDefinition,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";

import DashboardProfileCard from "./DashboardProfileCard/DashboardProfileCard";
import DashboardSidebarItem from "./DashboardSidebarItem/DashboardSidebarItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useLogout } from "@/hooks/useLogout";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle/LanguageToggle";
import { useTranslation } from "react-i18next";

export interface SidebarItemInterface {
  id: number;
  labelKey: string;
  icon: IconDefinition;
  path?: string;
  children?: SidebarItemInterface[];
}

const getSidebarItems = (t: (key: string) => string): SidebarItemInterface[] => [
  { id: 0, labelKey: "dashboard.home", icon: faHouse, path: "" },
  {
    id: 1,
    labelKey: "dashboard.navigation",
    icon: faTh,
    path: "/admin/navigation",
  },
  { id: 2, labelKey: "dashboard.themes", icon: faLeaf, path: "/admin/themes" },
  { id: 3, labelKey: "dashboard.pages", icon: faFileText, path: "/admin/pages" },
  {
    id: 4,
    labelKey: "dashboard.addPost",
    icon: faFile,
    path: "/admin/post-format",
  },
  {
    id: 5,
    labelKey: "dashboard.bulkPostUpload",
    icon: faCloudUpload,
    path: "/admin/bulk-upload",
  },
  {
    id: 6,
    labelKey: "dashboard.posts",
    icon: faBars,
    children: [
      {
        id: 7,
        labelKey: "dashboard.allPosts",
        icon: faFileAlt,
        path: "/admin/posts/all",
      },
      {
        id: 8,
        labelKey: "dashboard.sliderPosts",
        icon: faRss,
        path: "/admin/posts/slider-posts",
      },
      {
        id: 9,
        labelKey: "dashboard.featuredPosts",
        icon: faStar,
        path: "/admin/posts/featured-posts",
      },
      {
        id: 10,
        labelKey: "dashboard.breakingNews",
        icon: faBolt,
        path: "/admin/posts/breaking-news",
      },
    ],
  },
  {
    id: 15,
    labelKey: "dashboard.categories",
    icon: faLayerGroup,
    path: "/admin/categories",
  },
  { id: 16, labelKey: "dashboard.tags", icon: faTag, path: "/admin/tags" },
];

export default function DashboardSidebar() {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, isLoading } = useLogout();
  const { t } = useLanguage();
  const { t: i18nT } = useTranslation();
  const sidebarItems = getSidebarItems(i18nT);
  
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
            <h1 className="hidden md:block text-xl text-white ml-2"><span className="font-bold">Admin</span> {t('dashboard.adminPanel')}</h1>
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
        
        {/* Language Toggle */}
        <div className="mt-4 border-t border-gray-600 pt-4">
          <div className="flex justify-center md:justify-start mb-3">
            <LanguageToggle variant="dark" />
          </div>
        </div>
        
        {/* Logout Button */}
        <div className="border-t border-gray-600 pt-4">
          <button
            type="button"
            onClick={() => logout()}
            disabled={isLoading}
            className="w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="text-lg" />
            <span className="hidden md:inline font-medium">
              {isLoading ? t('common.loading') : t('dashboard.logout')}
            </span>
          </button>
        </div>
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
