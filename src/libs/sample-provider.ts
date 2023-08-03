import { ApiKeyManagerProvider } from "../interfaces/main";

export class DefaultApiKeyManagerProvider implements ApiKeyManagerProvider {
  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private readonly baseUrl: string;
  private readonly token: string;

  private innerFetch = async (
    url: string,
    okStatus: number,
    method: string = "GET",
    body?: object
  ) => {
    const headers: Record<string, string> = {
      authorization: `Bearer ${this.token}`,
    };

    if (body) {
      headers["content-type"] = "application/json";
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      method,
      headers,
      body: JSON.stringify(body),
    });

    if (response.status !== okStatus) {
      throw new Error(
        `Failed '${method}' operation calling '${url}'
         - ${response.status}: ${response.statusText}`
      );
    }

    if (response.headers.get("content-type")?.includes("application/json")) {
      const data = await response.json();
      return data;
    }
    // otherwise just return
    return;
  };

  getConsumers = async () => {
    const data = await this.innerFetch(`/consumers/my`, 200);
    return data;
  };

  rollKey = async (consumerName: string, expiresOn: Date) => {
    await this.innerFetch(`/consumers/${consumerName}/roll`, 200, "POST", {
      expiresOn,
    });
  };

  deleteKey = async (consumerName: string, keyId: string) => {
    await this.innerFetch(
      `/consumers/${consumerName}/keys/${keyId}`,
      204,
      "DELETE"
    );
  };

  updateConsumerDescription = async (
    consumerName: string,
    description: string
  ) => {
    const data = await this.innerFetch(
      `/consumers/${consumerName}`,
      200,
      "PATCH",
      {
        description,
      }
    );
    return data;
  };
}
