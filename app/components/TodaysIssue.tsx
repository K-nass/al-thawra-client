import { Calendar, Newspaper, AlertCircle } from "lucide-react";
import { Link } from "react-router";
import { ScrollAnimation } from "./ScrollAnimation";

interface UrgentNewsItem {
  title: string;
  slug: string;
  categorySlug: string;
}

interface TodaysIssueProps {
  issueNumber?: string;
  date?: string;
  magazineCover?: string;
  magazineDate?: string; // Date in YYYY-MM-DD format for routing
  urgentNews?: UrgentNewsItem[];
}

export function TodaysIssue({
  issueNumber,
  date,
  magazineCover,
  magazineDate,
  urgentNews = []
}: TodaysIssueProps) {

  // Don't render if no magazine data is provided
  if (!issueNumber) {
    return null;
  }

  return (
    <ScrollAnimation animation="slideUp" duration={0.6} once={true}>
      <section>
        {/* Header */}
        <div>
          {/* Decorative elements */}
          <div></div>
          <div></div>

          {/* Content Section */}
          <div>
            <div>
              <div>
                <Newspaper />
              </div>
              <div>
                <h2>عدد اليوم</h2>
                <div>
                  <div>
                    <Calendar />
                    <span>{date}</span>
                  </div>
                  <span></span>
                  <span>{issueNumber}</span>
                </div>
              </div>
            </div>

            {/* Magazine Cover - Square */}
            <Link
              to={magazineDate ? `/magazines/date/${magazineDate}` : "/magazines"}
            >
              {magazineCover ? (
                <img
                  src={magazineCover}
                  alt="غلاف العدد"
                />
              ) : (
                <div>
                  <Newspaper />
                </div>
              )}
              {/* Overlay on hover */}
              <div>
                <span>اقرأ<br />العدد</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Urgent News Ticker */}
        {urgentNews && urgentNews.length > 0 && (
          <div>
            <div>
              {/* Fixed Label */}
              <div>
                <AlertCircle />
                <span>عاجل</span>
              </div>

              {/* Scrolling News */}
              <div>
                <div>
                  {/* Duplicate the news items for seamless loop */}
                  {[...urgentNews, ...urgentNews].map((news, index) => (
                    <div key={index}>
                      <Link
                        to={`/posts/categories/${news.categorySlug}/articles/${news.slug}`}
                      >
                        {news.title}
                      </Link>
                      <span>•</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CSS Animation for Ticker */}
        <style>{`
          @keyframes scroll-rtl {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .animate-scroll-rtl {
            animation: scroll-rtl 15s linear infinite;
          }
          
          .animate-scroll-rtl:hover {
            animation-play-state: paused;
          }
        `}</style>

      </section>
    </ScrollAnimation>
  );
}
