interface AuthorCardProps {
  name: string;
  role?: string;
  image?: string;
  href?: string;
}

export function AuthorCard({ name, role, image, href }: AuthorCardProps) {
  const content = (
    <div className="flex items-start gap-4 py-4">
      {image && (
        <img
          src={image}
          alt={name}
          className="w-16 h-16 object-cover flex-shrink-0"
        />
      )}
      <div>
        <p className="text-2xl font-bold text-gray-800 font-serif">{name}</p>
        {role && <p className="text-base text-gray-500 mt-0.5">{role}</p>}
      </div>
    </div>
  );

  return (
    <div className="px-4 mb-2">
      {href ? (
        <a href={href} className="block hover:opacity-80 transition-opacity">
          {content}
        </a>
      ) : (
        content
      )}
      <hr className="border-dashed border-gray-300" />
    </div>
  );
}
