import { CachedQuery } from "../interfaces/query";

export async function asyncQuery({
  setIsLoading,
  setError,
  setData,
  queryFn,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: CachedQuery<any>) {
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
