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

import React from "react";

import DownloadIcon from "@mui/icons-material/Download";
import LinkIcon from "@mui/icons-material/Link";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";

import { IMovie } from "../../interfaces";

export interface IMovieDrawerProps {
  readonly movie: IMovie | null;

  readonly open: boolean;
  readonly onOpen: () => void;
  readonly onClose: () => void;
}

export const MovieDrawer: React.FC<IMovieDrawerProps> = ({
  movie,
  open,
  onOpen,
  onClose,
}) => {
  if (!movie) {
    return null;
  }

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onOpen={onOpen}
      onClose={onClose}
    >
      <List>
        <ListItem>
          <Typography variant="h6" component="div" noWrap>
            {movie.name}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography paragraph>{movie.description}</Typography>
        </ListItem>
      </List>
      <Divider />
      <List>
        {movie.torrents.map((x) => (
          <ListItem
            key={x.name}
            disableGutters
            secondaryAction={
              <IconButton
                onClick={() => {
                  try {
                    navigator.clipboard
                      .writeText(x.magnet)
                      .then(() => {
                        alert("Magnet successfully copied!");
                      })
                      .catch((error) => {
                        alert(error);
                      });
                  } catch (error) {
                    alert(error);
                  }
                }}
              >
                <LinkIcon />
              </IconButton>
            }
          >
            <ListItemButton
              onClick={() => {
                window.open(x.link, "_blank");
              }}
            >
              <ListItemIcon>
                <DownloadIcon />
              </ListItemIcon>
              <ListItemText primary={x.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </SwipeableDrawer>
  );
};
