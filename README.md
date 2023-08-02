# React API Key Manager

This react component allows you to manager API keys given a provider configuration.

## Installation

Via NPM

```
npm install @zuplo/react-api-key-manager
```

## Usage

You can import the `ReactAPIKeyManager` into your React project directly.

```TS
import ReactAPIKeyManager from "@zuplo/react-api-key-manager";

const MyComponent = () => {
   const defaultProvider = new DefaultApiKeyMgmtControlProvider(
      "<BASE_URL>",
      "<ACCESS_TOKEN>"
    );

   return (
      <ReactAPIKeyManager provider={provider} />
   );
}

```
