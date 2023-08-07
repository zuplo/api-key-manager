import { useContext } from "react";
import { QueryEngineContext } from "./context";

export function useQueryEngineContext() {
  const ctx = useContext(QueryEngineContext);
  if (!ctx) {
    throw new Error("Invalid State - ControlContext not found");
  }
  return ctx;
}
