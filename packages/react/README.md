 <h1 align="center">React API Key Manager</h1>

<p align="center">
  <a aria-label="Zuplo logo" href="https://zuplo.com">
    <img src="https://img.shields.io/badge/MADE%20BY%20Zuplo-FF00BD.svg?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAzNyAzMiIgYXJpYS1oaWRkZW49InRydWUiPgogIDxwYXRoIGZpbGw9IiNGRjAwQkQiIGQ9Ik0yNy4xNDIgMTkuOTc4SDE2LjYyTDI3LjgzIDguNzQ2YS43NTguNzU4IDAgMDAtLjUzNC0xLjI5M0g5LjQ4OFYwaDE5LjUzNGE3LjU3MyA3LjU3MyAwIDAxNC4wNjUgMS4xMjUgNy41OTEgNy41OTEgMCAwMTIuODM2IDMuMTI2IDcuNDAyIDcuNDAyIDAgMDEtMS40NjEgOC4zOThsLTcuMzIgNy4zMjh6Ii8+CiAgPHBhdGggZmlsbD0iI0ZGMDBCRCIgZD0iTTkuNDg5IDExLjA0MmgxMC41MjRsLTExLjE5IDExLjIxYS43NzIuNzcyIDAgMDAuNTQzIDEuMzE2aDE3Ljc1OXY3LjQ1Mkg3LjYxYTcuNTc0IDcuNTc0IDAgMDEtNC4wNjUtMS4xMjVBNy41OTMgNy41OTMgMCAwMS43MSAyNi43NjhhNy40MDMgNy40MDMgMCAwMTEuNDYyLTguMzk3bDcuMzE4LTcuMzI5eiIvPgo8L3N2Zz4K&labelColor=000">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@zuplo/react-api-key-manager">
    <img alt="" src="https://img.shields.io/npm/v/@zuplo/react-api-key-manager.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a aria-label="License" href="https://github.com/zuplo/api-key-manager/blob/main/LICENSE">
    <img alt="" src="https://img.shields.io/npm/l/@zuplo/react-api-key-manager.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a aria-label="Join the community on Discord" href="https://discord.gg/Y87N4SxjvJ">
    <img alt="" src="https://img.shields.io/badge/Chat%20on%20discord-5865F2.svg?style=for-the-badge&logo=discord&labelColor=000000&logoWidth=20">
  </a>
</p>

## Overview

A react component for managing API keys that is compatible with any API Key
management API.

![Component Screenshot](https://cdn.zuplo.com/assets/cedd8ad0-9433-4433-80f6-86545ba0d41a.png)

To see a demo of the component visit https://api-key-manager.com.

Try it out by following our detailed [walkthrough tutorial](https://github.com/zuplo/api-key-manager/).

## Getting Started

This component can be used with any React framework. It is compatible with
TailwindCSS, but Tailwind is not required.

### Install

Install the component in your React project

```bash
npm install @zuplo/react-api-key-manager
```

### With Tailwind

Import the component's stylesheet into your `global.css` or equivalent file. The
styles will use your project's tailwind configuration to provide a consistent
theme.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
@import "@zuplo/react-api-key-manager/tailwind.css";
```

### Without Tailwind

Import the component's stylesheet into your root component (i.e. `App.jsx`),
typically below your other stylesheets.

```jsx
import "./styles/globals.css";
import "@zuplo/react-api-key-manager/index.css";
```

### Custom Styles

The the component's css can be completely customized by copying either the
`tailwind.css` or `index.css` files from
`node_modules/@zuplo/react-api-key-manager/dist/` and modifying the styles to
suite your needs.

## Usage

You can import the `ReactAPIKeyManager` into your React project directly.

```ts
import {
  ApiKeyManager,
  DefaultApiKeyManagerProvider,
} from "@zuplo/react-api-key-manager";

const MyComponent = () => {
  const defaultProvider = new DefaultApiKeyManagerProvider(
    "<BASE_URL>",
    "<ACCESS_TOKEN>",
  );

  return <ApiKeyManager provider={defaultProvider} />;
};
```

## Backend API

The API Key Manager component interacts with an API that allows authorized users
to manage their own keys. The easiest way to get started is to use the
[Auth Translation API](https://github.com/zuplo/sample-auth-translation-api)
sample and deploy it to [Zuplo](https://zuplo.com). By default this sample
connects the
[Zuplo API Key Management Service](https://zuplo.com/docs/articles/api-key-management),
but you could adapt the sample to use other services or data storage systems.

## Custom Provider

If you don't want to build an API that conforms to the built-in provider, you
can implement a custom `ApiKeyManagerProvider` in your client to use an existing
or custom API. The Interface for the provider is shown below. Additionally, you
can see the default implementation in
[`packages/react/src/default-provider.ts`](https://github.com/zuplo/api-key-manager/blob/main/packages/react/src/default-provider.ts)

## Community and Contribution

We welcome community contributions and ideas. Please feel free to open an issue
or propose a pull request. [Join us on Discord](https://discord.gg/Y87N4SxjvJ)
if you have questions, feedback, or just want to hang out.

## License

MIT License

Copyright © 2023 Zuplo, Inc. All rights reserved.
