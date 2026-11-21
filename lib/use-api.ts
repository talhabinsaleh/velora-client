"use client";

import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "./api";

// Loads JSON from the API whenever `path` changes. `reload()` fetches it again.
export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(path !== null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    api<T>(path, { signal: controller.signal })
      .then((result) => setData(result))
      .catch((err) => {
        if ((err as Error).name !== "AbortError") setError(errorMessage(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [path, tick]);

  const reload = useCallback(() => setTick((n) => n + 1), []);
  return { data, error, loading, reload, setData };
}
