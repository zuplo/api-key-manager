import { useContext } from "react";
import { QueryEngineContext } from "../contexts/QueryEngineContext";

export function useQueryEngineContext() {
  const ctx = useContext(QueryEngineContext);
  if (!ctx) {
    throw new Error("Invalid State - ControlContext not found");
  }
  return ctx;
}
