# API Key Console Sample

This sample shows how to create your own Developer Console that uses the Zuplo API Key Service (https://dev.zuplo.com/docs) to help your developers manage their own API keys.

## Features

- Auth0 Login
- Zuplo API Key Manager
- Light and dark mode

## Run locally

1. Clone the repo

```
npx create-next-app --example \
  https://github.com/zuplo/api-key-manager/tree/main/examples/nextjs
```

2. Add `NEXT_PUBLIC_API_URL` value to `.env.local` file

If you don't have an API Key service, you can use this one: `https://api-key-live-sample-main-21ced70.d2.zuplo.dev`.

If you want to create your own, you can follow the tutorial from our blogpost [here](https://zuplo.com/blog/2023/08/08/open-source-release).

3. Run the sample

```
npm run dev
```

### Future iteration TODOs

- Add delete confirm dialog
- Add roll key dialog with option to choose
