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

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export const useMoviesColumns = (): number => {
  const theme = useTheme();

  const matchesXs = useMediaQuery(theme.breakpoints.up("xs"));
  const matchesSm = useMediaQuery(theme.breakpoints.up("sm"));
  const matchesMd = useMediaQuery(theme.breakpoints.up("md"));
  const matchesLg = useMediaQuery(theme.breakpoints.up("lg"));
  const matchesXl = useMediaQuery(theme.breakpoints.up("xl"));

  const moviesColumns = useMemo(() => {
    if (matchesXl) {
      return 7;
    }

    if (matchesLg) {
      return 6;
    }

    if (matchesMd) {
      return 4;
    }

    if (matchesSm) {
      return 3;
    }

    if (matchesXs) {
      return 2;
    }

    return 1;
  }, [matchesXs, matchesSm, matchesMd, matchesLg, matchesXl]);

  return moviesColumns;
};
