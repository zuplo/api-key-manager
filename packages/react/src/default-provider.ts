import { ApiKeyManagerProvider, RegisterHandle } from "./interfaces";

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
    body?: object,
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

    const isExpectedResponse = response.status === okStatus;
    const contentType = response.headers.get("content-type");
    if (
      contentType?.includes("application/json") ||
      contentType?.includes("application/problem+json")
    ) {
      let responseError: Error;
      try {
        const jsonData = await response.json();
        if (isExpectedResponse) {
          return jsonData;
        }
        if ("title" in jsonData || "detail" in jsonData) {
          const { title, detail } = jsonData;

          responseError = new Error(
            `Failed '${method}' operation calling '${url}'
             -> ${title} ${detail ? `: ${detail}` : ""}`,
          );
        } else {
          responseError = new Error(
            `Failed '${method}' operation calling '${url}'
             -> ${JSON.stringify(jsonData)}`,
          );
        }
      } catch (e) {
        responseError = new Error(
          `Failed to parse JSON response from '${url}' - ${
            (e as Error).message
          }`,
        );
      }

      throw responseError;
    }

    const text = await response.text();
    if (!isExpectedResponse) {
      throw new Error(
        `Failed '${method}' operation calling '${url}'
         -> ${response.status}: ${text.substring(0, 100)}`,
      );
    }
    // otherwise just return
    return;
  };

  getConsumers = async () => {
    const data = await this.innerFetch(`/consumers/my`, 200);
    return data;
  };

  rollKey = async (consumerName: string, expiresOn: Date) => {
    await this.innerFetch(`/consumers/${consumerName}/roll`, 204, "POST", {
      expiresOn,
    });
  };

  deleteKey = async (consumerName: string, keyId: string) => {
    await this.innerFetch(
      `/consumers/${consumerName}/keys/${keyId}`,
      204,
      "DELETE",
    );
  };

  createConsumer = async (description: string) => {
    await this.innerFetch(`/consumers/my`, 200, "POST", {
      description,
    });
  };

  deleteConsumer = async (consumerName: string) => {
    await this.innerFetch(`/consumers/${consumerName}`, 204, "DELETE");
  };

  readonly #callbacks: Map<RegisterHandle, () => void> = new Map();

  registerOnRefresh = async (callback: () => void) => {
    const handle = new RegisterHandle();
    this.#callbacks.set(handle, callback);
    console.log(
      `registerOnRefresh callback, now have ${this.#callbacks.size} callbacks`,
    );
  };

  unregisterOnRefresh = async (handle: RegisterHandle) => {
    this.#callbacks.delete(handle);
    `unregisterOnRefresh callback, now have ${this.#callbacks.size} callbacks`;
  };

  refresh = () => {
    this.#callbacks.forEach((callback) => callback());
  };

  updateConsumerDescription = async (
    consumerName: string,
    description: string,
  ) => {
    const data = await this.innerFetch(
      `/consumers/${consumerName}`,
      200,
      "PATCH",
      {
        description,
      },
    );
    return data;
  };
}
