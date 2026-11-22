import type { NextConfig } from "next";
import path from "path";

// Static export so the site can be hosted free on GitHub Pages (or any static host).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
