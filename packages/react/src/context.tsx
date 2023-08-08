import { createContext } from "react";
import { QueryEngine } from "./useProviderQueryEngine";

export const QueryEngineContext = createContext<QueryEngine | undefined>(
  undefined,
);
