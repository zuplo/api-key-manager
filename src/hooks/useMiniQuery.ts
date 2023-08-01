import { useEffect, useState } from "react";
import { asyncQuery } from "../libs/async-query";
import { CachedQuery, QueryFn } from "../interfaces/query";

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
      queryFn: queryFn,
    };

    cache[queryId] = cachedQuery;
    void asyncQuery(cachedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoading, data, error };
}
