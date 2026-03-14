import { Header } from "./Header";
import { Footer } from "./Footer";
import { NavigationSidebar } from "./NavigationSidebar";
import type { Category } from "../../services/categoriesService";
import type { Page } from "../../services/pagesService";

interface LayoutProps {
  children: React.ReactNode;
  categories?: Category[];
  footerPages?: Page[];
  logoSettings?: { ceoName: string };
}

export function Layout({ children, categories = [], footerPages = [], logoSettings }: LayoutProps) {
  return (
    <div>
      <Header categories={categories} ceoName={logoSettings?.ceoName} />
      <NavigationSidebar categories={categories} />
      <main>
        {children}
      </main>
      <Footer pages={footerPages} categories={categories} />
    </div>
  );
}
