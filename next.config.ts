import type { NextConfig } from 'next'
import { BASE_URL } from './lib/urls'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [new URL(`${BASE_URL}/**`)],
	},
}

export default nextConfig
