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

import DnsIcon from "@mui/icons-material/Dns";
import HomeIcon from "@mui/icons-material/Home";
import { ListItem } from "@mui/material";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import { useSettingsContext } from "../../../common";

export interface ILayoutDrawerProps {
  readonly open: boolean;
  readonly onOpen: () => void;
  readonly onClose: () => void;
}

export const LayoutDrawer: React.FC<ILayoutDrawerProps> = ({
  open,
  onOpen,
  onClose,
}) => {
  const { promptMoviesDataUrl } = useSettingsContext();

  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onOpen={onOpen}
      onClose={onClose}
    >
      <List>
        <ListItem>
          <ListItemText>Settings</ListItemText>
        </ListItem>
        <ListItemButton
          onClick={() => {
            promptMoviesDataUrl();
            onClose();
          }}
        >
          <ListItemIcon>
            <DnsIcon />
          </ListItemIcon>
          <ListItemText primary="Movies Data URL" />
        </ListItemButton>
        <Divider />
        <ListItem>
          <ListItemText>About</ListItemText>
        </ListItem>
        <ListItemButton
          onClick={() => {
            window.open("https://github.com/KillWolfVlad/kt-web", "_blank");
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Source Code" />
        </ListItemButton>
      </List>
    </SwipeableDrawer>
  );
};
