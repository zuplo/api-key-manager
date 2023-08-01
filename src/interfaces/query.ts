import { Dispatch, SetStateAction } from "react";

export type QueryFn<T> = () => Promise<T>;
export interface CachedQuery<T> {
  setData: Dispatch<SetStateAction<T | undefined>>;
  setError: Dispatch<SetStateAction<unknown | undefined>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  queryFn: QueryFn<unknown>;
}
