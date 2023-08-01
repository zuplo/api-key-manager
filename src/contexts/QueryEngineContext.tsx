import { createContext } from "react";
import { QueryEngine } from "../hooks/useProviderQueryEngine";

export const QueryEngineContext = createContext<QueryEngine | undefined>(
  undefined
);
