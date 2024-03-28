import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import dotenv from "dotenv";
import removeConsole from "vite-plugin-remove-console";

dotenv.config(); // Load environment variables

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), removeConsole()],
  // server: {
  //   port: 8080,
  // },
});
