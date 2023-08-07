import { useCallback } from "react";
import { ApiKeyManagerProvider, ConsumerData } from "./interfaces";
import {
  MutationState,
  useMiniMutation,
} from "./components/mini-query/useMiniMutation";
import {
  QueryState,
  refreshQuery,
  useMiniQuery,
} from "./components/mini-query/useMiniQuery";

const MY_CONSUMERS_KEY = "my-consumers";
const INVALIDATE_OPTIONS = { invalidateQueriesOnSuccess: [MY_CONSUMERS_KEY] };

interface ConsumerDescriptionMutationOptions {
  consumerName: string;
  description: string;
}

interface RollKeyMutationOptions {
  consumerName: string;
  expiresOn: Date;
}

interface DeleteKeyMutationOptions {
  consumerName: string;
  keyId: string;
}

export interface QueryEngine {
  useMyConsumersQuery: () => QueryState<ConsumerData>;
  refreshMyConsumers: () => Promise<void>;
  useRollKeyMutation: () => MutationState<RollKeyMutationOptions>;
  useConsumerDescriptionMutation: () => MutationState<ConsumerDescriptionMutationOptions>;
  useDeleteKeyMutation: () => MutationState<DeleteKeyMutationOptions>;
}

const queryEngineMap = new Map<ApiKeyManagerProvider, QueryEngine>();

export function useProviderQueryEngine(
  provider: ApiKeyManagerProvider
): QueryEngine {
  const cached = queryEngineMap.get(provider);

  if (cached) {
    return cached;
  }

  const useMyConsumersQuery = () => {
    return useMiniQuery(
      useCallback(() => {
        return provider.getConsumers();
      }, []),
      MY_CONSUMERS_KEY
    );
  };

  const useRollKeyMutation = () => {
    return useMiniMutation(
      ({ consumerName, expiresOn }: RollKeyMutationOptions) => {
        return provider.rollKey(consumerName, expiresOn);
      },
      INVALIDATE_OPTIONS
    );
  };

  const useConsumerDescriptionMutation = () => {
    return useMiniMutation(
      ({ consumerName, description }: ConsumerDescriptionMutationOptions) => {
        return provider.updateConsumerDescription(consumerName, description);
      },
      INVALIDATE_OPTIONS
    );
  };

  const useDeleteKeyMutation = () => {
    return useMiniMutation(
      ({ consumerName, keyId }: DeleteKeyMutationOptions) => {
        return provider.deleteKey(consumerName, keyId);
      },
      INVALIDATE_OPTIONS
    );
  };

  const refreshMyConsumers = async () => {
    refreshQuery(MY_CONSUMERS_KEY);
  };

  const result = {
    useMyConsumersQuery,
    refreshMyConsumers,
    useRollKeyMutation,
    useConsumerDescriptionMutation,
    useDeleteKeyMutation,
  };

  queryEngineMap.set(provider, result);

  return result;
}
