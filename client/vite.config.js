// Vite is the tool that runs and builds the React app.
// The react() plugin lets Vite understand JSX syntax.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 } // the address the Express CORS setting expects
});
