import { Header } from "./Header";
import { Footer } from "./Footer";
import { SecondaryTopBar } from "./SecondaryTopBar";
import type { Category } from "../../services/categoriesService";
import type { Page } from "../../services/pagesService";
import type { Post } from "../../services/postsService";

interface LayoutProps {
  children: React.ReactNode;
  categories?: Category[];
  footerPages?: Page[];
  logoSettings?: { ceoName: string };
  breakingNews?: Post[];
}

export function Layout({ children, categories = [], footerPages = [], logoSettings, breakingNews = [] }: LayoutProps) {
  return (
    <div>
      <Header categories={categories} ceoName={logoSettings?.ceoName} />
      <SecondaryTopBar breakingNews={breakingNews} />
      <main>
        {children}
      </main>
      <Footer pages={footerPages} categories={categories} />
    </div>
  );
}
