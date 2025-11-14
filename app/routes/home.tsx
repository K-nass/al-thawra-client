import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import FeaturedArticle from "~/components/FeaturedArticle";
import NewsSection from "~/components/NewsSection";
import SecondaryNav from "~/components/SecondaryNav";
import SectionHeader from "~/components/SectionHeader";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "الثورة" },
    { name: "description", content: "جريدة الثورة - أخبار محلية وعالمية" },
  ];
}

export async function loader() {
  console.log("Home loader called");
  console.log("API_URL:", process.env.API_URL);
  
  const apiUrl = process.env.API_URL || 'http://cms-dev.runasp.net/api/v1';
  
  try {
    // First, fetch categories that should show on homepage (same as admin panel)
    console.log("Fetching homepage categories...");
    const categoriesUrl = `${apiUrl}/categories?IsActive=true`;
    console.log("Categories URL:", categoriesUrl);
    const categoriesResponse = await fetch(categoriesUrl);
    if (!categoriesResponse.ok) {
      const errorText = await categoriesResponse.text();
      console.error("Categories API Error:", errorText);
      throw new Error(`Categories API Error: ${categoriesResponse.status} - ${errorText}`);
    }
    const categoriesData = await categoriesResponse.json();
    
    // Filter categories that should show on homepage and sort by order
    const homepageCategories = categoriesData
      .filter((cat: any) => cat.showOnHomepage && cat.isActive)
      .sort((a: any, b: any) => a.order - b.order);
    
    console.log("Homepage categories:", homepageCategories.map((c: any) => `${c.name} (order: ${c.order})`));

    // Fetch all posts
    console.log("Fetching all posts...");
    const allPostsUrl = `${apiUrl}/posts?HasAuthor=true&Status=published&PageNumber=1&PageSize=30`;
    console.log("All posts URL:", allPostsUrl);
    const allPostsResponse = await fetch(allPostsUrl);
    if (!allPostsResponse.ok) {
      const errorText = await allPostsResponse.text();
      console.error("Posts API Error:", errorText);
      throw new Error(`Posts API Error: ${allPostsResponse.status} - ${errorText}`);
    }
    const allPostsData = await allPostsResponse.json();
    const allPosts = allPostsData.items || [];
    console.log("Total posts fetched:", allPosts.length);

    // Find featured post (first one with isFeatured=true, or first post)
    const featuredPost = allPosts.find((post: any) => post.isFeatured) || allPosts[0];
    console.log("Featured post:", featuredPost?.title);

    // Group posts by category ID for better matching
    const postsByCategory: { [key: string]: any[] } = {};
    allPosts.forEach((post: any) => {
      const categoryId = post.categoryId;
      if (categoryId) {
        if (!postsByCategory[categoryId]) {
          postsByCategory[categoryId] = [];
        }
        postsByCategory[categoryId].push(post);
      }
    });

    // Create sections based on homepage categories in order
    const sections = homepageCategories.map((category: any) => {
      const categoryPosts = postsByCategory[category.id] || [];
      return {
        id: category.id,
        title: category.name,
        slug: category.slug,
        color: category.colorHex,
        order: category.order,
        posts: categoryPosts.slice(0, 6), // Limit to 6 posts per section
        postsCount: categoryPosts.length
      };
    }).filter((section: any) => section.posts.length > 0);

    console.log("Sections created:", sections.map((s: any) => `${s.title} (${s.posts.length} posts, order: ${s.order})`));

    return {
      featuredPost,
      sections,
      categories: homepageCategories,
      // Keep only essential data for existing components
      localNews: [],
      breakingNews: allPosts.filter((post: any) => post.isBreaking),
      opinion: [],
      trending: [],
    };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    console.log("API error - returning empty data");
    
    return {
      featuredPost: null,
      sections: [],
      categories: [],
      localNews: [],
      breakingNews: [],
      opinion: [],
      trending: [],
    };
  }
}





export default function Home() {
  const { featuredPost, sections, breakingNews } = useLoaderData<typeof loader>();


  // Transform API data to component format
  const transformApiData = (posts: any[]) => {
    return posts.map(post => ({
      id: post.id,
      title: post.title,
      date: post.createdAt ? new Date(post.createdAt).toLocaleDateString('ar-KW', { 
        timeZone: 'UTC',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '',
      image: post.image || "",
      category: post.categoryName || "",
      description: post.description || "",
      author: post.authorName || "",
      views: post.viewsCount || 0,
      isPortrait: false,
      type: "article" as const,
      categoryColor: "text-blue-500", // Add required categoryColor
    }));
  };


  // Fallback to sample data if API data is not available
  const displayFeaturedData = featuredPost ? {
    title: featuredPost.title,
    category: featuredPost.categoryName || "",
    description: featuredPost.description || "",
    date: featuredPost.createdAt || '2025-11-12T14:02:48.6927669',
    videoImage: featuredPost.image || "",
    videoTitle: featuredPost.title,
    videoCategory: featuredPost.categoryName || "",
    sideImage: featuredPost.image || "",
  } : {
    title: 'عنوان المقال الرئيسي',
    category: 'محليات',
    description: 'وصف المقال الرئيسي هنا يوضح محتوى المقال بالتفصيل',
    date: '2025-11-12T14:02:48.6927669',
    videoImage: "",
    videoTitle: 'عنوان المقال الرئيسي',
    videoCategory: 'محليات',
    sideImage: "",
  };

  // Only use API data from sections
  const displayBreakingNews = breakingNews.length > 0 ? transformApiData(breakingNews) : [];

  return (
    <div style={{ backgroundColor: '#E0E7EE', minHeight: '100vh' }}>
      <SecondaryNav />
      
      {/* Featured Article Section */}
      <div className="py-6">
        <div className="container mx-auto px-4 max-w-7xl">
          <FeaturedArticle {...displayFeaturedData} />
        </div>
      </div>

      {/* Breaking News Section */}
      {displayBreakingNews.length > 0 && (
        <section className="py-6">
          <div className="bg-white rounded-lg mx-4 max-w-7xl mx-auto">
            <div className="container mx-auto px-4 py-6">
              <SectionHeader 
                leftLink={{
                  text: "عاجل",
                  href: "#"
                }}
                rightText="أخبار عاجلة"
              />
              <NewsSection title="" articles={displayBreakingNews} showViewMore={false} />
            </div>
          </div>
        </section>
      )}

      {/* Category Sections */}
      {sections && sections.map((section: any, index: number) => (
        <section key={section.slug} className="py-6">
          <div className={index % 2 === 0 ? "bg-white rounded-lg mx-4 max-w-7xl mx-auto" : "bg-gray-50 rounded-lg mx-4 max-w-7xl mx-auto"}>
            <div className="container mx-auto px-4 py-6">
              <SectionHeader 
                leftLink={{
                  text: "المزيد",
                  href: `/category/${section.slug}`
                }}
                rightText={section.title}
              />
              <NewsSection title="" articles={transformApiData(section.posts)} showViewMore={false} />
            </div>
          </div>
        </section>
      ))}

      {/* Newsletter Section */}
      <section className="py-12">
        <div className="bg-white rounded-lg mx-4 max-w-7xl mx-auto">
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              اشترك في نشرتنا البريدية
            </h2>
            <p className="text-gray-700 mb-6">
              احصل على أحدث الأخبار مباشرة في بريدك الإلكتروني
            </p>
            <form className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none border border-gray-300"
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
              >
                اشترك
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
