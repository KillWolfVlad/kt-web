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

export function getCountryFlag(countries: string[]): string | null {
  for (const c of countries) {
    if (c in countryFlagMap) {
      return countryFlagMap[c];
    }
  }
  return null;
}
