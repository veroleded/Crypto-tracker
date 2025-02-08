# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's inside?

This turborepo uses [pnpm](https://pnpm.io) as a package manager. It includes the following packages/apps:

### Apps and Packages

- `nextjs`: a [Next.js](https://nextjs.org/) app
- `@acme/api`: an API package powered by [tRPC](https://trpc.io/)
- `@acme/auth`: authentication using [Supabase Auth](https://supabase.com/auth)
- `@acme/db`: database package using [Drizzle](https://orm.drizzle.team/)
- `@acme/ui`: a React component library shared by applications
- `@acme/validators`: validation library using [Zod](https://zod.dev/)
- `@acme/eslint-config`: ESLint configurations
- `@acme/prettier-config`: Prettier configurations
- `@acme/typescript-config`: TypeScript configurations

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Installation

> [!NOTE]
>
> Make sure to follow the system requirements specified in [`package.json#engines`](./package.json#L4) before proceeding.

There are two ways of initializing an app using the `create-t3-turbo` starter. You can either use this repository as a template:

![use-as-template](https://github.com/t3-oss/create-t3-turbo/assets/51714798/bb6c2e5d-d8b6-416e-aeb3-b3e50e2ca994)

or use Turbo's CLI to init your project (use PNPM as package manager):

```bash
npx create-turbo@latest -e https://github.com/t3-oss/create-t3-turbo
```

## About

Ever wondered how to migrate your T3 application into a monorepo? Stop right here! This is the perfect starter repo to get you running with the perfect stack!

It uses [Turborepo](https://turborepo.org) and contains:

```text
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ auth-proxy
  |   ├─ Nitro server to proxy OAuth requests in preview deployments
  |   └─ Uses Auth.js Core
  ├─ expo
  |   ├─ Expo SDK 51
  |   ├─ React Native using React 18
  |   ├─ Navigation using Expo Router
  |   ├─ Tailwind using NativeWind
  |   └─ Typesafe API calls using tRPC
  └─ next.js
      ├─ Next.js 14
      ├─ React 18
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
  ├─ api
  |   └─ tRPC v11 router definition
  ├─ auth
  |   └─ Authentication using next-auth.
  ├─ db
  |   └─ Typesafe db calls using Drizzle & Supabase
  └─ ui
      └─ Start of a UI package for the webapp using shadcn-ui
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  ├─ tailwind
  |   └─ shared tailwind configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

> In this template, we use `@acme` as a placeholder for package names. As a user, you might want to replace it with your own organization or project name. You can use find-and-replace to change all the instances of `@acme` to something like `@my-company` or `@project-name`.

## Quick Start

> **Note**
> The [db](./packages/db) package is preconfigured to use Supabase and is **edge-bound** with the [Vercel Postgres](https://github.com/vercel/storage/tree/main/packages/postgres) driver. If you're using something else, make the necessary modifications to the [schema](./packages/db/src/schema.ts) as well as the [client](./packages/db/src/index.ts) and the [drizzle config](./packages/db/drizzle.config.ts). If you want to switch to non-edge database driver, remove `export const runtime = "edge";` [from all pages and api routes](https://github.com/t3-oss/create-t3-turbo/issues/634#issuecomment-1730240214).

To get it running, follow the steps below:

### 1. Setup dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Drizzle schema to the database
pnpm db:push
```

### 2. Configure Expo `dev`-script

#### Use iOS Simulator

1. Make sure you have XCode and XCommand Line Tools installed [as shown on expo docs](https://docs.expo.dev/workflow/ios-simulator).

   > **NOTE:** If you just installed XCode, or if you have updated it, you need to open the simulator manually once. Run `npx expo start` from `apps/expo`, and then enter `I` to launch Expo Go. After the manual launch, you can run `pnpm dev` in the root directory.

   ```diff
   +  "dev": "expo start --ios",
   ```

2. Run `pnpm dev` at the project root folder.

#### Use Android Emulator

1. Install Android Studio tools [as shown on expo docs](https://docs.expo.dev/workflow/android-studio-emulator).

2. Change the `dev` script at `apps/expo/package.json` to open the Android emulator.

   ```diff
   +  "dev": "expo start --android",
   ```

3. Run `pnpm dev` at the project root folder.

### 3. Configuring Next-Auth to work with Expo

In order to get Next-Auth to work with Expo, you must either:

#### Deploy the Auth Proxy (RECOMMENDED)

In [apps/auth-proxy](./apps/auth-proxy) you can find a Nitro server that proxies OAuth requests. By deploying this and setting the `AUTH_REDIRECT_PROXY_URL` environment variable to the URL of this proxy, you can get OAuth working in preview deployments and development for Expo apps. See more deployment instructions in the [auth proxy README](./apps/auth-proxy/README.md).

By using the proxy server, the Next.js apps will forward any auth requests to the proxy server, which will handle the OAuth flow and then redirect back to the Next.js app. This makes it easy to get OAuth working since you'll have a stable URL that is publically accessible and doesn't change for every deployment and doesn't rely on what port the app is running on. So if port 3000 is taken and your Next.js app starts at port 3001 instead, your auth should still work without having to reconfigure the OAuth provider.

#### Add your local IP to your OAuth provider

You can alternatively add your local IP (e.g. `192.168.x.y:$PORT`) to your OAuth provider. This may not be as reliable as your local IP may change when you change networks. Some OAuth providers may also only support a single callback URL for each app making this approach unviable for some providers (e.g. GitHub).

### 4a. When it's time to add a new UI component

Run the `ui-add` script to add a new UI component using the interactive `shadcn/ui` CLI:

```bash
pnpm ui-add
```

When the component(s) has been installed, you should be good to go and start using it in your app.

### 4b. When it's time to add a new package

To add a new package, simply run `pnpm turbo gen init` in the monorepo root. This will prompt you for a package name as well as if you want to install any dependencies to the new package (of course you can also do this yourself later).

The generator sets up the `package.json`, `tsconfig.json` and a `index.ts`, as well as configures all the necessary configurations for tooling around your package such as formatting, linting and typechecking. When the package is created, you're ready to go build out the package.

## FAQ

### Does the starter include Solito?

No. Solito will not be included in this repo. It is a great tool if you want to share code between your Next.js and Expo app. However, the main purpose of this repo is not the integration between Next.js and Expo — it's the code splitting of your T3 App into a monorepo. The Expo app is just a bonus example of how you can utilize the monorepo with multiple apps but can just as well be any app such as Vite, Electron, etc.

Integrating Solito into this repo isn't hard, and there are a few [official templates](https://github.com/nandorojo/solito/tree/master/example-monorepos) by the creators of Solito that you can use as a reference.

### Does this pattern leak backend code to my client applications?

No, it does not. The `api` package should only be a production dependency in the Next.js application where it's served. The Expo app, and all other apps you may add in the future, should only add the `api` package as a dev dependency. This lets you have full typesafety in your client applications, while keeping your backend code safe.

If you need to share runtime code between the client and server, such as input validation schemas, you can create a separate `shared` package for this and import it on both sides.

## Deployment

### Next.js

#### Prerequisites

> **Note**
> Please note that the Next.js application with tRPC must be deployed in order for the Expo app to communicate with the server in a production environment.

#### Deploy to Vercel

Let's deploy the Next.js application to [Vercel](https://vercel.com). If you've never deployed a Turborepo app there, don't worry, the steps are quite straightforward. You can also read the [official Turborepo guide](https://vercel.com/docs/concepts/monorepos/turborepo) on deploying to Vercel.

1. Create a new project on Vercel, select the `apps/nextjs` folder as the root directory. Vercel's zero-config system should handle all configurations for you.

2. Add your `DATABASE_URL` environment variable.

3. Done! Your app should successfully deploy. Assign your domain and use that instead of `localhost` for the `url` in the Expo app so that your Expo app can communicate with your backend when you are not in development.

### Auth Proxy

The auth proxy is a Nitro server that proxies OAuth requests in preview deployments. This is required for the Next.js app to be able to authenticate users in preview deployments. The auth proxy is not used for OAuth requests in production deployments. To get it running, it's easiest to use Vercel Edge functions. See the [Nitro docs](https://nitro.unjs.io/deploy/providers/vercel#vercel-edge-functions) for how to deploy Nitro to Vercel.

Then, there are some environment variables you need to set in order to get OAuth working:

- For the Next.js app, set `AUTH_REDIRECT_PROXY_URL` to the URL of the auth proxy.
- For the auth proxy server, set `AUTH_REDIRECT_PROXY_URL` to the same as above, as well as `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET` (or the equivalent for your OAuth provider(s)). Lastly, set `AUTH_SECRET` **to the same value as in the Next.js app** for preview environments.

Read more about the setup in [the auth proxy README](./apps/auth-proxy/README.md).

### Expo

Deploying your Expo application works slightly differently compared to Next.js on the web. Instead of "deploying" your app online, you need to submit production builds of your app to app stores, like [Apple App Store](https://www.apple.com/app-store) and [Google Play](https://play.google.com/store/apps). You can read the full [guide to distributing your app](https://docs.expo.dev/distribution/introduction), including best practices, in the Expo docs.

1. Make sure to modify the `getBaseUrl` function to point to your backend's production URL:

   <https://github.com/t3-oss/create-t3-turbo/blob/656965aff7db271e5e080242c4a3ce4dad5d25f8/apps/expo/src/utils/api.tsx#L20-L37>

2. Let's start by setting up [EAS Build](https://docs.expo.dev/build/introduction), which is short for Expo Application Services. The build service helps you create builds of your app, without requiring a full native development setup. The commands below are a summary of [Creating your first build](https://docs.expo.dev/build/setup).

   ```bash
   # Install the EAS CLI
   pnpm add -g eas-cli

   # Log in with your Expo account
   eas login

   # Configure your Expo app
   cd apps/expo
   eas build:configure
   ```

3. After the initial setup, you can create your first build. You can build for Android and iOS platforms and use different [`