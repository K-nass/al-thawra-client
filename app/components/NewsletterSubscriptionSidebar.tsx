import { useState } from "react";
import type { Category } from "../services/categoriesService";

interface BriefingService {
  id: string;
  name: string;
  description: string;
  frequency: string;
}

interface NewsletterSubscriptionSidebarProps {
  newsletterCategories?: Category[];
  className?: string;
}

export default function NewsletterSubscriptionSidebar({
  newsletterCategories = [],
  className = "",
}: NewsletterSubscriptionSidebarProps) {
  const [email, setEmail] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const services: BriefingService[] = newsletterCategories
    .sort((a, b) => a.order - b.order)
    .slice(0, 10)
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description || "اشترك للحصول على آخر التحديثات",
      frequency: "حسب التحديثات",
    }));

  const [selectedServices, setSelectedServices] = useState<string[]>(() =>
    services.slice(0, 2).map((s) => s.id)
  );

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const displayedServices = isExpanded ? services : services.slice(0, 7);

  return (
    <aside
      className={"bg-[#b8d4e0] flex flex-col"}
    >
      {/* Sticky Header Section */}
      <div className="bg-[#b8d4e0] z-10 border-b border-dashed border-black/30 pb-3">
        <div className="p-3">
          <h2 className="text-lg font-bold mb-3 text-black">
            اشترك في نشراتنا الإخبارية
          </h2>

          <form onSubmit={handleSubmit} className="mb-2">
            <div className="flex border border-black overflow-hidden">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                dir="rtl"
                className="flex-1 min-w-0 px-2 py-1.5 text-sm text-black placeholder-gray-600 focus:outline-none bg-white border-0"
              />
              <button
                type="submit"
                className="shrink-0 px-3 py-1.5 bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors border-r border-black"
              >
                إرسال
              </button>
            </div>
          </form>

          <p className="text-sm text-gray-700 text-center">
            {selectedServices.length} نشرات مختارة
          </p>
        </div>
      </div>

      {/* Scrollable Services List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-3">
          {displayedServices.map((service) => (
            <div key={service.id} className="border-b border-dashed border-black/30 pb-3 last:border-b-0">
              <label className="flex items-start gap-2 cursor-pointer group">
                <div className="relative shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-black bg-[#d0e8f2] peer-checked:bg-black peer-checked:border-black flex items-center justify-center transition-colors">
                    {selectedServices.includes(service.id) && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-black mb-1 group-hover:text-gray-700 transition-colors">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600 font-semibold">{service.frequency}</span>
                    <span className="text-blue-700 hover:underline cursor-pointer">اقرأها</span>
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Collapse/Expand Button */}
      <div className="border-t border-dashed border-black/30 p-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "إخفاء الخدمات" : "عرض جميع الخدمات"}
          className="w-full flex items-center justify-center py-1 text-black hover:bg-black/5 transition-colors rounded"
        >
          {isExpanded ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>
    </aside>
  );
}
