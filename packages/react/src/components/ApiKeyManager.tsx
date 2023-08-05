import { QueryEngineContext } from "../context";
import { XCircleIcon } from "../icons";
import { ApiKeyManagerProvider, MenuItem } from "../interfaces";
import { useProviderQueryEngine } from "../useProviderQueryEngine";
import ConsumerControl from "./ConsumerControl";
import ConsumerLoading from "./ConsumerLoading";

import styles from "./ApiKeyManager.module.css";

interface Props {
  provider: ApiKeyManagerProvider;
  menuItems?: MenuItem[];
}

function ApiKeyManager({ provider, menuItems }: Props) {
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
            menuItems={menuItems}
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
