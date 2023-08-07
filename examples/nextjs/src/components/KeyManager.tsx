import ApiKeyManager, {
  Consumer,
  DefaultApiKeyManagerProvider,
} from "@zuplo/react-api-key-manager";
import { useCallback, useMemo, useState } from "react";
import Spinner from "./Spinner";

interface Props {
  apiUrl: string;
  accessToken: string;
}

export default function KeyManager({ apiUrl, accessToken }: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [showIsLoading, setShowIsLoading] = useState(false);

  const provider = useMemo(() => {
    return new DefaultApiKeyManagerProvider(apiUrl, accessToken);
  }, [apiUrl, accessToken]);

  const createConsumer = useCallback(
    async (description: string) => {
      try {
        setIsCreating(true);
        await provider.createConsumer(description);
        provider.refresh();
      } catch (err) {
        // TODO
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [provider]
  );

  const deleteConsumer = useCallback(
    async (consumerName: string) => {
      try {
        setShowIsLoading(true);
        await provider.deleteConsumer(consumerName);
        provider.refresh();
      } catch (err) {
        // TODO
        throw err;
      } finally {
        setShowIsLoading(false);
      }
    },
    [provider]
  );

  function clickCreateConsumer() {
    const desc = window.prompt("Enter a description for your new API Key");
    if (desc) {
      createConsumer(desc);
    }
  }

  const menuItems = useMemo(() => {
    return [
      {
        label: "Delete",
        action: (consumer: Consumer) => {
          deleteConsumer(consumer.name);
        },
      },
    ];
  }, [deleteConsumer]);

  return (
    <div>
      <ApiKeyManager
        provider={provider}
        menuItems={menuItems}
        showIsLoading={showIsLoading}
      />
      <button
        onClick={clickCreateConsumer}
        className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg flex flex-row items-center"
      >
        {isCreating && (
          <div className="h-5 w-5 mr-2 text-white">
            <Spinner />
          </div>
        )}
        Create new API Key
      </button>
    </div>
  );
}
