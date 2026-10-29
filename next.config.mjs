import { fileURLToPath } from "node:url";

// Next's Google Fonts loader supports a local response file. The response file
// contains genuine Google-font WOFF2 assets from Fontsource, so builds are
// reproducible even when fonts.googleapis.com is unavailable. Next still
// fingerprints, self-hosts, and preloads the fonts; browsers never contact Google.
process.env.NEXT_FONT_GOOGLE_MOCKED_RESPONSES ??= fileURLToPath(
  new URL("./scripts/google-font-responses.cjs", import.meta.url),
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["three"],

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
