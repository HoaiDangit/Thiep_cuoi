import type { NextConfig } from "next";
import { WEDDING_BASE_PATH } from './lib/paths';

const nextConfig: NextConfig = {
  basePath: WEDDING_BASE_PATH,
  async redirects() {
    // Keep previously shared invitation and setup links working after the move.
    return ['/', '/login', '/setup', '/account', '/invite/:path*'].map(source => ({
      source,
      destination: WEDDING_BASE_PATH + (source === '/' ? '' : source),
      basePath: false as const,
      permanent: true,
    }));
  },
};

export default nextConfig;
