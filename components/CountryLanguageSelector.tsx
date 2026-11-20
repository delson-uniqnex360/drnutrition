import Link from "next/link";

const countries = [
  { name: "UAE", code: "en-ae" },
  { name: "Saudi Arabia", code: "en-sa" },
  { name: "Oman", code: "en-om" },
  { name: "Kuwait", code: "en-kw" },
  { name: "Jordan", code: "en-jo" },
  { name: "Bahrain", code: "en-bh" },
  { name: "Qatar", code: "en-qa" },
  { name: "India", code: "en-in" },
  { name: "Morocco", code: "en-ma" },
  { name: "Pakistan", code: "en-pk" },
  { name: "Kenya", code: "en-ke" },
  { name: "Nigeria", code: "en-ng" },
  { name: "Egypt", code: "en-eg" },
  { name: "Singapore", code: "en-sg" },
  { name: "Philippines", code: "en-ph" },
];

const languages = [
  { name: "English", code: "en", href: "/en-ae" },
  { name: "العربية", code: "ar", href: "/ar-ae" },
];

type CountryLanguageSelectorProps = {
  activeCountry?: string;
  activeLanguage?: string;
};

export default function CountryLanguageSelector({
  activeCountry = "en-ae",
  activeLanguage = "en",
}: CountryLanguageSelectorProps) {
  return (
    <div className="container mx-auto px-4 py-5 space-y-4">
      {/* Country */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Country
        </p>

        <ul className="flex flex-wrap gap-x-3 gap-y-2">
          {countries.map((country) => {
            const isActive = activeCountry === country.code;

            return (
              <li key={country.code}>
                <Link
                  href={`/${country.code}`}
                  hrefLang={country.code}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-sm underline-offset-2 hover:underline ${
                    isActive
                      ? "font-semibold text-primary"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  {country.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Language */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Language
        </p>

        <ul className="flex flex-wrap gap-x-3 gap-y-2">
          {languages.map((language) => {
            const isActive = activeLanguage === language.code;

            return (
              <li key={language.code}>
                <Link
                  href={language.href}
                  hrefLang={language.code}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-sm underline-offset-2 hover:underline ${
                    isActive
                      ? "font-semibold text-primary"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  {language.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
