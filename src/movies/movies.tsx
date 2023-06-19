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

import React, { useMemo, useState } from "react";

import ImageList from "@mui/material/ImageList";

import { useSearchContext } from "../common";

import { MovieDrawer, MovieItem } from "./components";
import { useMovies, useMoviesColumns } from "./hooks";
import { IMovie } from "./interfaces";

export const Movies: React.FC = () => {
  const { searchQuery } = useSearchContext();

  const [movieModalOpen, setMovieModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);

  const { movies, isMoviesFetching, moviesFetchingError } = useMovies();
  const moviesColumns = useMoviesColumns();

  const filteredMovies = useMemo(() => {
    if (!searchQuery) {
      return movies;
    }

    return movies.filter((x) =>
      x.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, movies]);

  if (isMoviesFetching) {
    return <div>Loading...</div>;
  }

  if (moviesFetchingError) {
    return <div>Error!</div>;
  }

  if (filteredMovies.length === 0) {
    return <div>No movies!</div>;
  }

  return (
    <>
      <MovieDrawer
        movie={selectedMovie}
        open={movieModalOpen}
        onOpen={() => {
          setMovieModalOpen(true);
        }}
        onClose={() => {
          setMovieModalOpen(false);
          setSelectedMovie(null);
        }}
      />
      <ImageList cols={moviesColumns}>
        {filteredMovies.map((movie) => (
          <MovieItem
            key={movie.id}
            movie={movie}
            onInfoButtonClicked={() => {
              setSelectedMovie(movie);
              setMovieModalOpen(true);
            }}
          />
        ))}
      </ImageList>
    </>
  );
};
