import ApiKeyManager, {
  DefaultApiKeyManagerProvider,
} from "@zuplo/react-api-key-manager";
import { useContext, useMemo } from "react";
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
