import ApiKeyManager, {
  DefaultApiKeyManagerProvider,
} from "@zuplo/react-api-key-manager";

interface Props {
  token: string;
}

export default function YourKeys({ token }: Props) {
  const provider = new DefaultApiKeyManagerProvider(
    "https://api-key-live-sample-main-21ced70.d2.zuplo.dev",
    token
  );

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="text-3xl font-bold">Your keys</h1>
      <div className="text-md">
        TODO - we do not support auto refreshing of this control automatically
        (browser refreshes shrug emoji)
      </div>
      <ApiKeyManager provider={provider} />
    </div>
  );
}
