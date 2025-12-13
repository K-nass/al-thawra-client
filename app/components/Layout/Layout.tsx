import { Header } from "./Header";
import { Footer } from "./Footer";
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
    <div className="flex flex-col min-h-screen">
      <Header categories={categories} ceoName={logoSettings?.ceoName} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer pages={footerPages} />
    </div>
  );
}
