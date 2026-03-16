interface ArticleImageFallbackProps {
  className?: string;
}

export default function ArticleImageFallback({ className = "" }: ArticleImageFallbackProps) {
  return (
    <div 
      className={`relative bg-gradient-to-br from-[#a0c4d0] via-[#b8d4e0] to-[#9bb8c4] flex flex-col items-center justify-center gap-4 ${className}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center opacity-80">
        <img 
          src="/formLogo.png" 
          alt="" 
          className="h-12 w-auto"
        />
      </div>

      {/* Article Icon */}
      <div className="flex items-center justify-center opacity-80">
        <img 
          src="/article.svg" 
          alt="" 
          className="w-16 h-16"
        />
      </div>
    </div>
  );
}
