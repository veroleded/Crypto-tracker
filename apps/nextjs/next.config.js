import { fileURLToPath } from "url";
import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@acme/api", "@acme/db", "@acme/ui", "@acme/validators"],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  /** Configure image domains */
  images: {
    remotePatterns: [{ hostname: "**" }],
  },

  /** Disable static generation for client components */
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },

  /** Build configuration */
  output: "standalone",
};

export default config;
