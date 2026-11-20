import Link from "next/link";
import Image from "next/image";

const announcements = [
  "GLP-1 Friendly Top Picks · Shop Now",
  "Up to 90% OFF · Flash Sale Shop Now",
  "Check out Our Deals Of The Day Collection · Shop Now",
];

const shortcuts = [
  { icon: "🛍️", label: "SHOP" },
  { icon: "⏱️", label: "NOW" },
  { icon: "📦", label: "PICKUP" },
  { icon: "📱", label: "MY HEALTH" },
];

const categories = [
  "All Categories",
  "Shop by Brand",
  "Branches",
  "Healthy Package",
  "Book Appointment",
  "Offers & Discounts",
  "Stacks & Combos",
  "Recipes",
  "Blog",
  "BMI Calculator",
];

const bottomLinks = [
  { label: "Home", href: "/", icon: "⌂" },
  { label: "Categories", href: "/categories", icon: "▦" },
  { label: "Offers", href: "/offers", icon: "◇" },
  { label: "Cart", href: "/cart", icon: "🛒" },
  { label: "More", href: "/more", icon: "•••" },
];

export default function SiteNavigation() {
  return (
    <>
      {/* Announcement ticker */}
      <div className="relative flex h-9 overflow-hidden bg-[#783781] text-white">
        <div className="flex w-max animate-[ticker_35s_linear_infinite] hover:[animation-play-state:paused]">
          {[...announcements, ...announcements].map((item, index) => (
            <span
              key={index}
              className="flex shrink-0 items-center gap-16 pr-16 text-xs font-bold"
            >
              {item}
              <span className="opacity-50">▪</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main header */}
      <header className="relative z-20 bg-gradient-to-b from-[#d9c4dc] via-[#f2eaf3] to-white">
        <div className="mx-auto max-w-[1450px] px-4">
          {/* Shortcut buttons */}
          <div className="hidden items-center gap-3 pt-3 md:flex">
            {shortcuts.map((item) => (
              <Link
                key={item.label}
                href="/"
                className="flex h-14 min-w-[150px] items-center justify-center gap-3 rounded-lg bg-white px-5 text-sm font-bold text-purple-800 transition hover:bg-purple-50"
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Logo and search */}
          <div className="flex flex-wrap items-center gap-4 py-4 md:py-5">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/logo_4.webp"
                width={150}
                height={100}
                alt="Logo"
                priority
                className="w-32 h-auto"
              />
            </Link>

            {/* Location */}
            <div className="hidden text-xs text-gray-600 lg:block">
              <span className="rounded-full bg-purple-100 px-3 py-1 text-purple-800">
                ● Shop
              </span>
              <p className="mt-2">Select address</p>
            </div>

            {/* Search */}
            <form
              action="/search"
              className="order-3 flex h-12 w-full items-center overflow-hidden rounded-full border border-gray-200 bg-white md:order-none md:ml-auto md:w-[40%]"
            >
              <input
                name="q"
                placeholder="Search For Supplements & Nutrition"
                className="h-full min-w-0 flex-1 bg-transparent px-5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                aria-label="Search"
                className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-800 text-xl text-white"
              >
                ⌕
              </button>
            </form>

            {/* Account options */}
            <div className="ml-auto flex items-center gap-3 text-sm text-gray-700 md:ml-0">
              <button className="hidden lg:block">العربية</button>

              <button className="hidden items-center gap-2 lg:flex">
                🇦🇪 UAE
              </button>

              <button
                aria-label="Messages"
                className="hidden h-10 w-10 items-center justify-center rounded-full bg-white lg:flex"
              >
                ♧
              </button>

              <Link href="/login" className="rounded-full bg-white px-4 py-2">
                ♙ Login
              </Link>
            </div>
          </div>

          {/* Desktop category navigation */}
          <nav className="hidden items-center justify-between gap-5 overflow-x-auto pb-5 text-sm text-gray-800 lg:flex">
            {categories.map((item) => (
              <Link
                key={item}
                href="/"
                className="shrink-0 whitespace-nowrap transition-colors hover:text-purple-800"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-[100] flex min-h-[66px] items-center justify-around border-t border-gray-200 bg-white/95 px-2 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))] shadow-[0_-4px_15px_rgba(0,0,0,0.04)] backdrop-blur-md lg:hidden"
      >
        {bottomLinks.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[11px] ${
              index === 0 ? "font-semibold text-[#783781]" : "text-gray-500"
            }`}
          >
            <span className="text-xl leading-none">{item.icon}</span>

            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
