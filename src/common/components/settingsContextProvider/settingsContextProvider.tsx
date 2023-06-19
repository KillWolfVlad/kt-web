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

import React, { PropsWithChildren } from "react";

import useLocalStorageState from "use-local-storage-state";

import { SettingsContext } from "../../contexts";

export const SettingsContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [moviesDataUrl, setMoviesDataUrl] = useLocalStorageState<string>(
    "moviesDataUrl",
    {
      defaultValue: "",
    },
  );

  return (
    <SettingsContext.Provider
      value={{
        moviesDataUrl,
        promptMoviesDataUrl() {
          const value = prompt("Enter Movies Data URL:", moviesDataUrl);

          if (value !== null) {
            setMoviesDataUrl(value);
          }
        },
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
