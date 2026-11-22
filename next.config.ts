import type { NextConfig } from "next";
const apiUrl = new URL(process.env.API_URL ?? "http://127.0.0.1:5000");
if (!["http:", "https:"].includes(apiUrl.protocol) || apiUrl.username || apiUrl.password || apiUrl.pathname !== "/" || apiUrl.search || apiUrl.hash) throw new Error("API_URL must be the server origin without a path or credentials.");
if (process.env.VERCEL && (apiUrl.protocol !== "https:" || ["localhost", "127.0.0.1", "[::1]"].includes(apiUrl.hostname))) throw new Error("Set API_URL to the deployed HTTPS RentDock server before deploying the client.");
const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiUrl.origin}/api/:path*` }];
  },
};
export default nextConfig;
