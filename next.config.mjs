/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const repo = "aurashopify";

const nextConfig = {
  output: "export",
  // GitHub Pages serves the project at /<repo>/
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
