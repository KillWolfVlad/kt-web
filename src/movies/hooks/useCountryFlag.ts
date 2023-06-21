/*
 * Copyright 2023 KillWolfVlad
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useMemo } from "react";

const data: Record<string, string> = {
  Россия: "🇷🇺",
  Казахстан: "🇰🇿",
  Беларусь: "🇧🇾",
  США: "🇺🇸",
  Япония: "🇯🇵",
  "Корея Южная": "🇰🇷",
  Китай: "🇨🇳",
  Индия: "🇮🇳",
};

export const useCountryFlag = (country: string): string | null => {
  return useMemo(() => {
    for (const [key, value] of Object.entries(data)) {
      if (country.includes(key)) {
        return value;
      }
    }

    return null;
  }, [country]);
};
