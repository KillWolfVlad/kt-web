import { useState } from "react";

export interface Filters {
  name: string;
  minRating: number | null;
  maxRating: number | null;
}

const defaultFilters: Filters = {
  name: "",
  minRating: null,
  maxRating: null,
};

export function useFilters() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  return { filters, setFilters };
}
