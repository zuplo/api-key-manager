import { QueryEngineContext } from "../context";
import { ApiKeyManagerProvider, MenuItem } from "../interfaces";
import { useProviderQueryEngine } from "../useProviderQueryEngine";
import ConsumerControl from "./ConsumerControl";
import ConsumerLoading from "./ConsumerLoading";
import { XCircleIcon } from "./icons";
import styles from "./ApiKeyManager.module.css";
import { useEffect } from "react";

interface Props {
  menuItems?: MenuItem[];
  theme?: "light" | "dark";
  provider: ApiKeyManagerProvider;
  showIsLoading?: boolean;
}

const getSystemDefaultThemePreference = (): "dark" | "light" => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

function ApiKeyManager({ provider, menuItems, showIsLoading, theme }: Props) {
  const queryEngine = useProviderQueryEngine(provider);
  const query = queryEngine.useMyConsumersQuery();
  const themeStyle = `zp-key-manager--${
    theme ?? getSystemDefaultThemePreference()
  }`;
  useEffect(() => {
    const handle = provider.registerOnRefresh(() => {
      queryEngine.refreshMyConsumers();
    });
    return () => {
      provider.unregisterOnRefresh(handle);
    };
  }, [provider, queryEngine]);

  if (!query.data && query.isLoading) {
    return (
      <div className={themeStyle}>
        <ConsumerLoading />
      </div>
    );
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
    return (
      <div className={themeStyle}>
        <div className={styles["no-keys-message"]}>You have no API keys</div>
      </div>
    );
  }

  const loading = query.isLoading || showIsLoading === true ? true : false;
  return (
    <QueryEngineContext.Provider value={queryEngine}>
      <div className={themeStyle}>
        {consumers.map((c) => {
          return (
            <ConsumerControl
              key={c.name}
              consumer={c}
              menuItems={menuItems}
              isLoading={loading}
            />
          );
        })}
      </div>
    </QueryEngineContext.Provider>
  );
}

export default ApiKeyManager;
