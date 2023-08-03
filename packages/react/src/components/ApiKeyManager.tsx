import { QueryEngineContext } from "../context";
import { ApiKeyManagerProvider, MenuItem } from "../interfaces";
import { useProviderQueryEngine } from "../useProviderQueryEngine";
import ConsumerControl from "./ConsumerControl";

interface Props {
  provider: ApiKeyManagerProvider;
  menuItems?: MenuItem[];
}

const ApiKeyManager = ({ provider, menuItems }: Props) => {
  const queryEngine = useProviderQueryEngine(provider);
  const query = queryEngine.useMyConsumersQuery();

  if (!query.data && query.isLoading) {
    // TODO - show glimmer (no dancing)?
    return <div>Loading...</div>;
  }

  const consumers = query.data?.data;

  if (!consumers || consumers.length === 0) {
    return <div>You have no API keys</div>;
  }

  return (
    <QueryEngineContext.Provider value={queryEngine}>
      {consumers.map((c) => {
        return (
          <ConsumerControl key={c.name} consumer={c} menuItems={menuItems} />
        );
      })}
    </QueryEngineContext.Provider>
  );
};

export default ApiKeyManager;
