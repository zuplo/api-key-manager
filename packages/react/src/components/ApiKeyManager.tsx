import { ApiKeyManagerProvider, DataModel, MenuItem } from "../interfaces";
import ConsumerControl from "./ConsumerControl";
import ConsumerLoading from "./ConsumerLoading";
import { XCircleIcon } from "./icons";
import styles from "./ApiKeyManager.module.css";
import { useEffect, useState } from "react";
import { DataContext, ProviderContext } from "./context";
import CreateConsumer from "./CreateConsumer";
import { RefreshProvider, refreshEventName } from "../refresh-provider";

type ThemeOptions = "light" | "dark" | "system";
type Theme = "light" | "dark";
interface Props {
  menuItems?: MenuItem[];
  /**
   * @default "light"
   */
  theme?: ThemeOptions;
  provider: ApiKeyManagerProvider;
  enableCreateConsumer?: boolean;
  enableDeleteConsumer?: boolean;
  refreshProvider?: RefreshProvider;
}

const getSystemDefaultThemePreference = (): Theme => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

const DEFAULT_DATA_MODEL: DataModel = {
  isFetching: false,
  consumers: undefined,
};

const getTheme = (theme: ThemeOptions): Theme => {
  if (theme === "system") {
    return getSystemDefaultThemePreference();
  }
  return theme;
};

function ApiKeyManager({
  provider,
  menuItems,
  theme = "light",
  enableCreateConsumer,
  enableDeleteConsumer,
  refreshProvider,
}: Props) {
  const themeStyle = `zp-key-manager--${getTheme(theme)}`;
  const [dataModel, setDataModel] = useState<DataModel>(DEFAULT_DATA_MODEL);
  const [error, setError] = useState<string | undefined>(undefined);

  const loadData = async (prov: ApiKeyManagerProvider) => {
    try {
      setDataModel({ ...dataModel, isFetching: true });
      const result = await prov.getConsumers();
      setDataModel({ consumers: result.data, isFetching: false });
    } catch (err) {
      setError((err as Error).message);
      setDataModel({ consumers: undefined, isFetching: false });
      console.error(err);
    }
  };

  useEffect(() => {
    if (refreshProvider) {
      const refreshCallback = () => {
        void loadData(provider);
      };

      refreshProvider.addEventListener(refreshEventName, refreshCallback);

      return () => {
        refreshProvider.removeEventListener(refreshEventName, refreshCallback);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshProvider, provider]);

  useEffect(() => {
    void loadData(provider);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  console.log("dataModel", dataModel);

  if (!dataModel.consumers && dataModel.isFetching) {
    return (
      <div className={themeStyle}>
        <ConsumerLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["query-error-border"]}>
        <div className={styles["query-error-body "]}>
          <div className={styles["query-error-heading"]}>
            <XCircleIcon className={styles["query-error-icon"]} />
            <span className={styles["query-error-heading-text"]}>Error</span>
          </div>
        </div>
        <div className={styles["query-error-message"]}>&quot;{error}&quot;</div>
      </div>
    );
  }

  const consumers = dataModel.consumers ?? [];

  if (consumers.length === 0) {
    return (
      <div className={themeStyle}>
        <div className={styles["no-keys-message"]}>You have no API keys</div>
      </div>
    );
  }

  return (
    <ProviderContext.Provider value={provider}>
      <DataContext.Provider value={[dataModel, setDataModel]}>
        <div className={themeStyle}>
          {consumers.map((c) => {
            return (
              <ConsumerControl
                key={c.name}
                consumer={c}
                menuItems={menuItems}
                enableDeleteConsumer={enableDeleteConsumer}
              />
            );
          })}
        </div>
        {enableCreateConsumer && <CreateConsumer />}
      </DataContext.Provider>
    </ProviderContext.Provider>
  );
}

export default ApiKeyManager;
