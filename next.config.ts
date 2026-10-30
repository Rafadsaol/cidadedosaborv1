import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

const staticDemo = process.env.DSAOL_STATIC_DEMO === "1";

const nextConfig: NextConfig = {
  ...(staticDemo ? { output: "export" as const, trailingSlash: true } : {}),
  // O celular acessa pelo IPv4 do computador, enquanto o servidor escuta em 0.0.0.0.
  allowedDevOrigins: Object.values(networkInterfaces()).flatMap(
    (interfaces) =>
      interfaces
        ?.filter(({ family }) => family === "IPv4")
        .map(({ address }) => address) ?? [],
  ),
  images: {
    unoptimized: staticDemo,
    qualities: [75, 90],
  },
};

export default nextConfig;
