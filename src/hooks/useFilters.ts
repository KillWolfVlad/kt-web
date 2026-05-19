import { useState } from "react";

export interface Filters {
  name: string;
  minRating: number | null;
}

const defaultFilters: Filters = {
  name: "",
  minRating: null,
};

export function useFilters() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  return { filters, setFilters };
}
