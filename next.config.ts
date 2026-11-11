import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Arena/e2b live-preview proxies the dev server under
  // https://{port}-{sandbox}.e2b.app — Next blocks cross-origin dev
  // resources (HMR, static chunks) by default, so allow preview hosts.
  allowedDevOrigins: [
    "imgaz4zr16zrxrvld4v46.e2b.app",
    "*.e2b.app",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
