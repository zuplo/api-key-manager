import ApiKeyManager, {
  Consumer,
  DefaultApiKeyManagerProvider,
} from "@zuplo/react-api-key-manager";
import { useCallback, useContext, useMemo, useState } from "react";
import Spinner from "./Spinner";
import { ThemeContext } from "@/contexts/ThemeContext";

interface Props {
  apiUrl: string;
  accessToken: string;
}

export default function KeyManager({ apiUrl, accessToken }: Props) {
  const [theme] = useContext(ThemeContext);

  const provider = useMemo(() => {
    return new DefaultApiKeyManagerProvider(apiUrl, accessToken);
  }, [apiUrl, accessToken]);

  return (
    <ApiKeyManager
      provider={provider}
      theme={theme}
      enableCreateConsumer={true}
      enableDeleteConsumer={true}
    />
  );
}
