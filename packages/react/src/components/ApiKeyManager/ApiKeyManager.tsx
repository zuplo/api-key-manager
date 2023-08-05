import { ApiKeyManagerProvider, MenuItem } from "../../interfaces";
import { QueryEngineContext } from "../../context";
import { useProviderQueryEngine } from "../../useProviderQueryEngine";
import ConsumerLoading from "../ConsumerControl/ConsumerLoading";
import { XCircleIcon } from "../../icons";

import styles from "./ApiKeyManager.module.css";
import ConsumerControl from "../ConsumerControl/ConsumerControl";
interface Props {
  provider: ApiKeyManagerProvider;
  menuItems?: MenuItem[];
}

const ApiKeyManager = ({ provider, menuItems }: Props) => {
  const queryEngine = useProviderQueryEngine(provider);
  const query = queryEngine.useMyConsumersQuery();
  const doo = true;
  if ((!query.data && query.isLoading) || !doo) {
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
    return <div className={styles["my-style"]}>You have no API keys</div>;
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
};

export default ApiKeyManager;
