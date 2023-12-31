export interface ApiKeyManagerProvider {
  getConsumers: () => Promise<ConsumerData>;
  rollKey: (consumerName: string, expiresOn: Date) => Promise<void>;
  deleteKey: (consumerName: string, keyId: string) => Promise<void>;
  updateConsumerDescription: (
    consumerName: string,
    description: string,
  ) => Promise<void>;
  createConsumer?: (description: string) => Promise<void>;
  deleteConsumer?: (consumerName: string) => Promise<void>;
}

export interface MenuItem {
  label: string;
  action: (consumer: Consumer) => void;
  icon?: JSX.Element;
}

export interface ConsumerData {
  data: Consumer[];
}

export interface Consumer {
  name: string;
  createdOn: string;
  description: string;
  apiKeys: ApiKey[];
}

export interface ApiKey {
  id: string;
  description: string;
  createdOn: string;
  updatedOn: string;
  expiresOn: string | null;
  key: string;
}

export interface DataModel {
  consumers?: Consumer[];
  isFetching: boolean;
}
