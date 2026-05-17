import { useMemo, useState } from "react";

export const useSearch = (items, keys) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) =>
      keys.some((key) => String(item[key] ?? "").toLowerCase().includes(query)),
    );
  }, [items, keys, searchTerm]);

  return { searchTerm, setSearchTerm, filteredItems };
};
