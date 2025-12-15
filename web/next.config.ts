import type { NextConfig } from "next";
import webpack from "webpack";

const nextConfig: NextConfig = {
  /* config options here */
  // Turbopack is the default in Next.js 16
  // It handles Node.js module exclusion automatically for client bundles
  
  // Exclude test files from production build
  webpack: (config, { isServer }) => {
    // Ignore test files and dev dependencies using IgnorePlugin
    config.plugins = [
      ...(config.plugins || []),
      new webpack.IgnorePlugin({
        resourceRegExp: /^tap$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^why-is-node-running$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^tape$/,
      }),
      // Ignore test files
      new webpack.IgnorePlugin({
        checkResource(resource) {
          // Ignore any file in test directories
          if (resource.includes('/test/') || resource.includes('\\test\\')) {
            return true;
          }
          return false;
        },
      }),
    ];
    
    // Fallback for Node.js modules that shouldn't be bundled
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    
    return config;
  },
  
  // Exclude test files from being processed (moved from experimental in Next.js 16)
  serverExternalPackages: ['thread-stream', '@walletconnect/ethereum-provider'],
};

export default nextConfig;
