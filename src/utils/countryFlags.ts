const countryFlagMap: Record<string, string> = {
  "Россия": "🇷🇺",
  "Казахстан": "🇰🇿",
  "Беларусь": "🇧🇾",
  "США": "🇺🇸",
  "Япония": "🇯🇵",
  "Корея Южная": "🇰🇷",
  "Китай": "🇨🇳",
  "Индия": "🇮🇳",
};

export function getCountryFlag(country: string): string | null {
  const countries = country.split(",").map((c) => c.trim());
  for (const c of countries) {
    if (c in countryFlagMap) {
      return countryFlagMap[c];
    }
  }
  return null;
}
