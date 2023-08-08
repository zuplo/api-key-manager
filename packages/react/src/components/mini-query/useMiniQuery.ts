import { useEffect, useState } from "react";
import { asyncQuery, CachedQuery, QueryFn } from "./async-query";

export interface QueryState<T> {
  isLoading: boolean;
  data?: T;
  error: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cache: Record<string, CachedQuery<any>> = {};

export function useMiniQuery<T>(
  queryFn: QueryFn<T>,
  queryId: string,
): QueryState<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<unknown | undefined>();

  useEffect(() => {
    const cachedQuery: CachedQuery<T> = {
      setIsLoading,
      setError,
      setData,
      queryFn,
    };

    cache[queryId] = cachedQuery;
    void asyncQuery(cachedQuery);
  }, [queryId, queryFn]);

  return { isLoading, data, error };
}

export async function refreshQuery(queryId: string) {
  const cachedQuery = cache[queryId];
  if (cachedQuery) {
    await asyncQuery(cachedQuery);
  }
}
