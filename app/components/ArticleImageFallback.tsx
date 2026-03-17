interface ArticleImageFallbackProps {
  className?: string;
}

export default function ArticleImageFallback({ className = "" }: ArticleImageFallbackProps) {
  return (
    <div 
      className={`relative bg-gradient-to-br from-[#a0c4d0] via-[#b8d4e0] to-[#9bb8c4] flex flex-col items-center justify-center gap-2 p-2 overflow-hidden ${className}`}
    >
      {/* Logo */}
      <div className="w-full flex-[0_0_22%] min-h-0 flex items-center justify-center opacity-80">
        <img 
          src="/formLogo.png" 
          alt="" 
          className="h-full w-auto max-w-[70%] object-contain"
        />
      </div>

      {/* Article Icon */}
      <div className="w-full flex-[0_0_48%] min-h-0 flex items-center justify-center opacity-80">
        <img 
          src="/article.svg" 
          alt="" 
          className="h-full w-auto max-w-[60%] object-contain"
        />
      </div>
    </div>
  );
}