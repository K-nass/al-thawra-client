import { Header } from "./Header";
import { Footer } from "./Footer";
import type { Category } from "../../services/categoriesService";
import type { Page } from "../../services/pagesService";

interface LayoutProps {
  children: React.ReactNode;
  categories?: Category[];
  footerPages?: Page[];
}

export function Layout({ children, categories = [], footerPages = [] }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header categories={categories} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer pages={footerPages} />
    </div>
  );
}
