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

import React, { useState } from "react";

import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

import { IMovie } from "../../interfaces";

import noPoster from "./no-poster.png";

export interface IMovieItemProps {
  readonly movie: IMovie;
  readonly onInfoButtonClicked: () => void;
}

export const MovieItem: React.FC<IMovieItemProps> = ({
  movie,
  onInfoButtonClicked,
}) => {
  const maxRetries = 10;

  const [posterUrl, setPosterUrl] = useState(movie.posterUrl);
  const [retriesCount, setRetriesCount] = useState(0);

  return (
    <ImageListItem>
      <img
        src={posterUrl}
        alt=""
        loading="lazy"
        onError={() => {
          if (retriesCount + 1 <= maxRetries) {
            setRetriesCount((value) => value + 1);
            setPosterUrl(noPoster);

            setTimeout(() => {
              setPosterUrl(movie.posterUrl);
            }, 1_000);
          } else {
            setPosterUrl(noPoster);
          }
        }}
      />
      <ImageListItemBar
        title={movie.name}
        subtitle={movie.rating}
        actionIcon={
          <IconButton
            sx={{ color: "rgba(255, 255, 255, 0.54)" }}
            onClick={onInfoButtonClicked}
          >
            <InfoIcon />
          </IconButton>
        }
      />
    </ImageListItem>
  );
};
