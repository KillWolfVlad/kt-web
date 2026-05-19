import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

function webhookTestPlugin(): Plugin {
  return {
    name: "webhook-test",
    configureServer(server) {
      server.middlewares.use("/test/webhook/200", (_req, res) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ status: "ok" }));
      });

      server.middlewares.use("/test/webhook/404", (_req, res) => {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ status: "error", message: "Not Found" }));
      });

      server.middlewares.use("/test/data.json", async (_req, res) => {
        const env = loadEnv(server.config.mode, server.config.root, "");
        const targetUrl = env.KT_DATA_URL;

        if (!targetUrl) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              status: "error",
              message: "KT_DATA_URL is not set in .env",
            }),
          );
          return;
        }

        try {
          const response = await fetch(targetUrl);

          if (!response.ok) {
            res.statusCode = response.status;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                status: "error",
                message: `Target server responded with ${response.status}`,
              }),
            );
            return;
          }

          const data = await response.json();
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(data));
        } catch (error) {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              status: "error",
              message: `Failed to fetch from target: ${error instanceof Error ? error.message : "Unknown error"}`,
            }),
          );
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "apple-touch-icon.png",
        "icon-192.png",
        "icon-512.png",
        "icon-192-maskable.png",
        "icon-512-maskable.png",
      ],
      manifest: {
        name: "KT Web",
        short_name: "KT Web",
        description: "Unofficial KinoTrend Web Version",
        theme_color: "#1a1a2e",
        background_color: "#1a1a2e",
        display: "standalone",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icon-192-maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
    webhookTestPlugin(),
  ],
});
