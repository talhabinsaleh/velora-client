"use client";

import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "./api";

interface State<T> {
  key: string | null;
  data: T | null;
  error: string | null;
}

// Loads JSON from the API whenever `path` changes. `reload()` fetches it again.
// While a new request runs, the previous data stays on screen (so tables don't flash empty).
export function useApi<T>(path: string | null) {
  const [tick, setTick] = useState(0);
  const key = path ? `${tick}:${path}` : null;
  const [state, setState] = useState<State<T>>({ key: null, data: null, error: null });

  useEffect(() => {
    if (!path || !key) return;
    const controller = new AbortController();
    api<T>(path, { signal: controller.signal })
      .then((data) => setState({ key, data, error: null }))
      .catch((err) => {
        if ((err as Error).name !== "AbortError") setState((s) => ({ key, data: s.data, error: errorMessage(err) }));
      });
    return () => controller.abort();
  }, [path, key]);

  const reload = useCallback(() => setTick((n) => n + 1), []);
  const setData = useCallback((update: (current: T | null) => T | null) => {
    setState((s) => ({ ...s, data: update(s.data) }));
  }, []);

  return {
    data: state.data,
    error: state.key === key ? state.error : null,
    loading: key !== null && state.key !== key,
    reload,
    setData,
  };
}
