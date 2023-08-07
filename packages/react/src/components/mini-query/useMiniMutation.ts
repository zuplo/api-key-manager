import { useState } from "react";
import { asyncQuery } from "./async-query";
import { cache } from "./useMiniQuery";

export interface MutationState<TVariables> {
  isLoading: boolean;
  wasSuccessful: boolean;
  error?: unknown;
  mutate: (variables: TVariables) => Promise<void>;
}

export type MutationFn<TVariables> = (variables: TVariables) => Promise<void>;

interface MutationOptions {
  invalidateQueriesOnSuccess?: string[];
}

export function useMiniMutation<TVariables>(
  mutationFn: MutationFn<TVariables>,
  options?: MutationOptions
): MutationState<TVariables> {
  const [isLoading, setIsLoading] = useState(false);
  const [wasSuccessful, setWasSuccessful] = useState(false);
  const [error, setError] = useState<unknown | undefined>();

  const mutate = async (variables: TVariables) => {
    try {
      setIsLoading(true);
      await mutationFn(variables);
      setError(undefined);
      setWasSuccessful(true);
      setIsLoading(false);
      options?.invalidateQueriesOnSuccess?.forEach((queryId) => {
        const cachedQuery = cache[queryId];
        if (cachedQuery) {
          asyncQuery(cachedQuery);
        }
      });
    } catch (err) {
      setError(err);
      setWasSuccessful(false);
      setIsLoading(false);
    }
  };

  return { isLoading, wasSuccessful, error, mutate };
}
