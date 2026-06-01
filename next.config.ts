import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "onnxruntime-web": "onnxruntime-web/dist/ort.min.js",
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "onnxruntime-web": "onnxruntime-web/dist/ort.min.js",
      };
    }
    config.module.rules.push({
      test: /\.(onnx|wasm)$/,
      type: "asset/resource",
    });
    return config;
  },
};

export default nextConfig;
