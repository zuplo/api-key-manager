import ApiKeyManager from "../components/ApiKeyManager";

// TODO - just trying to get this working right now, not sure this should be 'default' or export _type_ is best approach

export default ApiKeyManager;
export type {
  ApiKeyManagerProvider,
  Consumer,
  ConsumerData,
  ApiKey,
  MenuItem,
} from "../interfaces/main";
export type { DefaultApiKeyManagerProvider } from "../libs/default-provider";
