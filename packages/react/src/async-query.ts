import { Dispatch, SetStateAction } from "react";

export type QueryFn<T> = () => Promise<T>;
export interface CachedQuery<T> {
  setData: Dispatch<SetStateAction<T | undefined>>;
  setError: Dispatch<SetStateAction<unknown | undefined>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  queryFn: QueryFn<unknown>;
}

export async function asyncQuery({
  setIsLoading,
  setError,
  setData,
  queryFn,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
CachedQuery<any>) {
  try {
    setIsLoading(true);
    const data = await queryFn();
    setData(data);
    setError(undefined);
    setIsLoading(false);
  } catch (err) {
    setData(undefined);
    setError(err);
    setIsLoading(false);
  }
}
