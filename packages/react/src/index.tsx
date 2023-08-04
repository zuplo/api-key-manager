import ApiKeyManager from "./components/ApiKeyManager";

// TODO - just trying to get this working right now, not sure this should be 'default' or export _type_ is best approach

export default ApiKeyManager;
export { DefaultApiKeyManagerProvider } from "./default-provider";
export type {
  ApiKey,
  ApiKeyManagerProvider,
  Consumer,
  ConsumerData,
  MenuItem,
} from "./interfaces";
