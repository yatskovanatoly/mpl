import type { NextConfig } from "next";
import { BASE_URL } from "./lib/urls";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/mpl-results",
  assetPrefix: "/mpl-resutls",
  images: {
    remotePatterns: [new URL(`${BASE_URL}/**`)],
    unoptimized: true,
  },
};

export default nextConfig;
