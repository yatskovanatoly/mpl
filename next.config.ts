import type { NextConfig } from "next"
import { BASE_URL } from "./lib/urls"

const nextConfig: NextConfig = {
  output: "export",
  images: {
    remotePatterns: [new URL(`${BASE_URL}/**`)],
    unoptimized: true,
  },
}

export default nextConfig
