import { createContext, useContext } from "react";
import { ApiKeyManagerProvider, DataModel } from "../interfaces";

export const DataContext = createContext<
  [DataModel | undefined, (dataModel: DataModel) => void]
>([undefined, () => {}]);

export function useDataContext() {
  const ctx = useContext(DataContext);
  const [dataModel, setDataModel] = ctx;
  if (!dataModel || !setDataModel) {
    throw new Error(
      `Invalid state, no 'dataModel' or 'setDataModel' available`,
    );
  }
  return [dataModel, setDataModel] as [
    DataModel,
    (dataModel: DataModel) => void,
  ];
}

export const ProviderContext = createContext<ApiKeyManagerProvider | undefined>(
  undefined,
);

export function useProviderContext() {
  const pc = useContext(ProviderContext);
  if (!pc) {
    throw new Error(`Invalid state, no ProviderContext available`);
  }
  return pc;
}
