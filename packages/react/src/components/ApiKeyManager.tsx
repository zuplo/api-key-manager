import { ApiKeyManagerProvider, MenuItem } from "../interfaces";
import { QueryEngineContext } from "../context";
import { useProviderQueryEngine } from "../useProviderQueryEngine";
import ConsumerControl from "../components/ConsumerControl";
import ConsumerLoading from "../components/ConsumerLoading";
import { XCircleIcon } from "../icons";

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
      <div className="flex flex-col w-full  text-red-600 bg-slate-50 text-sm border border-red-600 rounded-lg">
        <div className="flex flex-row justify-between items-center bg-red-50 p-4 border-b rounded-t-lg border-red-600">
          <div className="flex flex-row items-center">
            <XCircleIcon className="h-4 w-4 mr-1" />
            <span className="font-bold">Error</span>
          </div>
        </div>
        <div className="pl-5 text-red-500 m-4 bg-slate-50">
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
          <ConsumerControl key={c.name} consumer={c} menuItems={menuItems} />
        );
      })}
    </QueryEngineContext.Provider>
  );
};

export default ApiKeyManager;
