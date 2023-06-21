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

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { useSettingsContext } from "../../common";
import { IMovie } from "../interfaces";

export interface IUseMoviesResult {
  readonly movies: readonly IMovie[];
  readonly isMoviesFetching: boolean;
  readonly moviesFetchingError: unknown;
}

export const useMovies = (): IUseMoviesResult => {
  const { moviesDataUrl, promptMoviesDataUrl } = useSettingsContext();

  const {
    data: movies,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["movies", moviesDataUrl],
    async queryFn() {
      if (!moviesDataUrl) {
        promptMoviesDataUrl();
        return [];
      }

      const { data } = await axios.get<{
        readonly movies: ReadonlyArray<{
          readonly filmID: number;

          readonly nameRU?: string;
          readonly description?: string;
          readonly rating?: string;
          readonly posterURL?: string;

          readonly country?: string;

          readonly torrents?: ReadonlyArray<{
            readonly audio?: string;
            readonly date?: string;
            readonly leechers?: number;
            readonly link?: string;
            readonly magnet?: string;
            readonly seeders?: number;
            readonly type?: string;
          }>;
        }>;
      }>(moviesDataUrl);

      return data.movies.map<IMovie>((rawMovie) => ({
        id: String(rawMovie.filmID),

        name: rawMovie.nameRU ?? "",
        description: rawMovie.description ?? "",
        rating: rawMovie.rating ?? "",
        posterUrl: rawMovie.posterURL ?? "",

        country: rawMovie.country ?? "",

        torrents:
          rawMovie.torrents?.map((rawTorrent) => ({
            name: [
              rawTorrent.type,
              rawTorrent.date,
              rawTorrent.audio,
              rawTorrent.seeders !== undefined
                ? `Seeders: ${rawTorrent.seeders}`
                : undefined,
              rawTorrent.leechers !== undefined
                ? `Leechers: ${rawTorrent.leechers}`
                : undefined,
            ]
              .filter((x) => x)
              .join(" / "),
            link: rawTorrent.link ?? "",
            magnet: rawTorrent.magnet ?? "",
          })) ?? [],
      }));
    },
  });

  return {
    movies: movies ?? [],
    isMoviesFetching: isFetching,
    moviesFetchingError: error,
  };
};
