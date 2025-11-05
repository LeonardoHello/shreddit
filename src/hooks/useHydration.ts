import { useEffect, useState } from "react";

export default function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setHydrated(true), 0);
    return () => clearTimeout(id);
  }, []);

  return hydrated;
}
