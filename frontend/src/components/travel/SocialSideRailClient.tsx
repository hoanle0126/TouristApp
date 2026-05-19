"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface SocialSideRailClientProps {
  readonly facebookUrl: string;
  readonly tiktokUrl: string;
  readonly instagramUrl: string;
}

function FacebookIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12z" />
    </svg>
  );
}

function InstagramIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.43a8.16 8.16 0 0 0 4.93 1.66V6.61a4.84 4.84 0 0 1-2-.92Z" />
    </svg>
  );
}

export function SocialSideRailClient({
  facebookUrl,
  tiktokUrl,
  instagramUrl,
}: Readonly<SocialSideRailClientProps>) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const links = [
    {
      href: facebookUrl,
      label: "Facebook",
      icon: FacebookIcon,
      hover: "hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2]",
    },
    {
      href: tiktokUrl,
      label: "TikTok",
      icon: TikTokIcon,
      hover: "hover:bg-stone-950 hover:text-white hover:border-stone-950",
    },
    {
      href: instagramUrl,
      label: "Instagram",
      icon: InstagramIcon,
      hover: "hover:bg-gradient-to-br hover:from-fuchsia-500 hover:via-rose-500 hover:to-amber-400 hover:text-white hover:border-transparent",
    },
  ].filter((link) => link.href.trim().length > 0);

  if (links.length === 0) {
    return null;
  }

  return (
    <aside
      aria-label="Social media"
      className="fixed left-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2 sm:left-4 sm:gap-3"
    >
      {links.map(({ href, label, icon: Icon, hover }) => (
        <Link
          aria-label={label}
          className={`group flex size-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-md shadow-stone-950/5 transition-all duration-200 hover:scale-110 hover:shadow-xl sm:size-11 ${hover}`}
          href={href}
          key={label}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon className="size-4 sm:size-5" />
        </Link>
      ))}
    </aside>
  );
}
