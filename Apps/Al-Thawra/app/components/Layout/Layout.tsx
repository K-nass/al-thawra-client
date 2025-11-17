import { Header } from "./Header";
import { Footer } from "./Footer";
import type { Category } from "../../services/categoriesService";

interface LayoutProps {
  children: React.ReactNode;
  categories?: Category[];
}

export function Layout({ children, categories = [] }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header categories={categories} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
