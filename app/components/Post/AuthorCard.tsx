import { Link } from "react-router";

interface AuthorCardProps {
  name: string;
  role?: string;
  bio?: string;
  image?: string;
  href?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  telegramUrl?: string;
  whatsAppUrl?: string;
  youtubeUrl?: string;
}

interface AuthorDetailsMiniProps {
  name: string;
  image?: string;
  href?: string;
}

export function AuthorCard({ name, role, bio, image, href }: AuthorCardProps) {
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
        {bio && <p className="text-sm text-gray-600 mt-2 leading-6">{bio}</p>}
      </div>
    </div>
  );

  return (
    <div className="px-4 mb-2">
      {href ? (
        <Link to={href} className="block hover:opacity-80 transition-opacity">
          {content}
        </Link>
      ) : (
        content
      )}
      <hr className="border-dashed border-gray-300" />
    </div>
  );
}

export function AuthorDetailsMini({
  name,
  image,
  href,
}: AuthorDetailsMiniProps) {
  const content = (
    <div className="flex items-center gap-2 py-2">
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-7 h-7 object-cover rounded-full flex-shrink-0"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
          {(name || "ك").trim().charAt(0)}
        </div>
      )}
      <p className="text-xs text-gray-600">
        بواسطة: <span className="font-semibold text-gray-800">{name}</span>
      </p>
    </div>
  );

  return (
    <div className="px-4 mb-1">
      {href ? (
        <Link
          to={href}
          className="inline-block hover:opacity-80 transition-opacity"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
}

export function KitabatAuthorCard({
  name,
  role,
  bio,
  image,
  href,
  twitterUrl,
  facebookUrl,
  instagramUrl,
  linkedinUrl,
  telegramUrl,
  whatsAppUrl,
  youtubeUrl,
}: AuthorCardProps) {
  const socialLinks = [
    {
      href: telegramUrl,
      label: "Telegram",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.78 18.65c-.39 0-.32-.15-.45-.52l-1.12-3.67 8.58-5.09c.4-.24.77-.11.47.16l-6.95 6.27-.27 3.8c.39 0 .56-.18.78-.39l1.87-1.82 3.89 2.87c.72.4 1.24.2 1.42-.67l2.58-12.16c.27-1.06-.4-1.54-1.09-1.23L4.24 12.07c-1.03.41-1.01.99-.19 1.24l3.89 1.21 9-5.68c.42-.25.8-.12.48.17" />
        </svg>
      ),
    },
    {
      href: twitterUrl,
      label: "X",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      href: facebookUrl,
      label: "Facebook",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      href: instagramUrl,
      label: "Instagram",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2m0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25zm8.875 1.125a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25M12 6.5A5.5 5.5 0 1 1 6.5 12 5.5 5.5 0 0 1 12 6.5m0 1.5A4 4 0 1 0 16 12a4 4 0 0 0-4-4" />
        </svg>
      ),
    },
    {
      href: linkedinUrl,
      label: "LinkedIn",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.98 3.5A2.48 2.48 0 1 1 2.5 5.98 2.48 2.48 0 0 1 4.98 3.5M3 8.75h3.96V21H3zm6.46 0h3.8v1.67h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-3.96v-5.72c0-1.36-.03-3.1-1.89-3.1s-2.18 1.48-2.18 3V21H9.46z" />
        </svg>
      ),
    },
    {
      href: whatsAppUrl,
      label: "WhatsApp",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
    },
    {
      href: youtubeUrl,
      label: "YouTube",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.4.58A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.88.58 9.4.58 9.4.58s7.52 0 9.4-.58a3 3 0 0 0 2.1-2.12A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8M9.75 15.52V8.48L15.98 12z" />
        </svg>
      ),
    },
  ].filter((link) => Boolean(link.href));
  return (
    <div className="shadow-sm w-fit mx-auto">
      <div className="flex flex-col items-center text-center py-8">
        {href ? (
          <Link to={href} className="group flex flex-col items-center hover:opacity-90 transition-opacity cursor-pointer">
            {image && (
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-4 border-gray-300">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-center"
                  />
                </div>
              </div>
            )}

            <h3 className="font-bold text-gray-900 mb-4 font-serif group-hover:underline">
              {name}
            </h3>
          </Link>
        ) : (
          <>
            {image && (
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-4 border-gray-300">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-center"
                  />
                </div>
              </div>
            )}

            <h3 className="font-bold text-gray-900 mb-4 font-serif">
              {name}
            </h3>
          </>
        )}

        {(role || bio) && (
          <p className="text-[14px] text-gray-700 leading-relaxed max-w-md px-4">
            {role && <span className="block mb-2">{role}</span>}
            {bio && <span className="block">{bio}</span>}
          </p>
        )}
      </div>

      {socialLinks.length > 0 && (
        <div className="flex items-center justify-center gap-8 py-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1a3a4a] transition-colors"
              aria-label={link.label}
            >
              {link.icon}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
