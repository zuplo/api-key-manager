import { ApiKeyManagerProvider, ConsumerData } from "../interfaces/main";
import { MutationState, useMiniMutation } from "./useMiniMutation";
import { QueryState, useMiniQuery } from "./useMiniQuery";

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
  useRollKeyMutation: () => MutationState<RollKeyMutationOptions>;
  useConsumerDescriptionMutation: () => MutationState<ConsumerDescriptionMutationOptions>;
  useDeleteKeyMutation: () => MutationState<DeleteKeyMutationOptions>;
}

export function useProviderQueryEngine(
  provider: ApiKeyManagerProvider
): QueryEngine {
  const useMyConsumersQuery = () => {
    return useMiniQuery(() => provider.getConsumers(), MY_CONSUMERS_KEY);
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

  return {
    useMyConsumersQuery,
    useRollKeyMutation,
    useConsumerDescriptionMutation,
    useDeleteKeyMutation,
  };
}
