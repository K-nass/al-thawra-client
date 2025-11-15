import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "القبس - الصحيفة الإلكترونية" },
    { name: "description", content: "صحيفة القبس الإلكترونية - أخبار محلية وعالمية" },
  ];
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          أهلا وسهلا بك في القبس
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          صحيفة القبس الإلكترونية - أخبار محلية وعالمية
        </p>
      </div>
    </div>
  );
}
