import { QueryEngineContext } from "../context";
import { ApiKeyManagerProvider, MenuItem } from "../interfaces";
import { useProviderQueryEngine } from "../useProviderQueryEngine";
import ConsumerControl from "./ConsumerControl";
import ConsumerLoading from "./ConsumerLoading";
import { XCircleIcon } from "./icons";

import { DefaultApiKeyManagerProvider } from "../provider";
import styles from "./ApiKeyManager.module.css";

interface DefaultProps {
  menuItems?: MenuItem[];
  apiUrl: string;
  accessToken: string;
}

interface CustomProviderProps {
  menuItems?: MenuItem[];
  provider: ApiKeyManagerProvider;
}

type Props = DefaultProps | CustomProviderProps;

function ApiKeyManager(props: Props) {
  let provider: ApiKeyManagerProvider;
  if ("provider" in props) {
    if (typeof props !== "object") {
      throw new Error(
        "The optional property 'provider' must be a valid ApiKeyManagerProvider object"
      );
    }
    provider = props.provider;
  } else {
    if (typeof props.apiUrl !== "string") {
      throw new Error("The property 'apiUrl' must be set to a string value");
    }
    if (typeof props.accessToken !== "string") {
      throw new Error(
        "The property 'accessToken' must be set to a string value"
      );
    }
    provider = new DefaultApiKeyManagerProvider(
      props.apiUrl,
      props.accessToken
    );
  }

  const queryEngine = useProviderQueryEngine(provider);
  const query = queryEngine.useMyConsumersQuery();
  if (!query.data && query.isLoading) {
    return <ConsumerLoading />;
  }

  if (query.error) {
    return (
      <div className={styles["query-error-border"]}>
        <div className={styles["query-error-body "]}>
          <div className={styles["query-error-heading"]}>
            <XCircleIcon className={styles["query-error-icon"]} />
            <span className={styles["query-error-heading-text"]}>Error</span>
          </div>
        </div>
        <div className={styles["query-error-message"]}>
          &quot;{query.error.toString()}&quot;
        </div>
      </div>
    );
  }

  const consumers = query.data?.data;

  if (!consumers || consumers.length === 0) {
    return <div>You have no API keys</div>;
  }

  return (
    <QueryEngineContext.Provider value={queryEngine}>
      {consumers.map((c) => {
        return (
          <ConsumerControl
            key={c.name}
            consumer={c}
            menuItems={props.menuItems}
            isLoading={query.isLoading}
          />
        );
      })}
    </QueryEngineContext.Provider>
  );
}

function ApiKeyManagerWrapper(props: Props) {
  return (
    <div className="zp-key-manager">
      <ApiKeyManager {...props} />
    </div>
  );
}

export default ApiKeyManagerWrapper;
