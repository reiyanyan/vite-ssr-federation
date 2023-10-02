import { UserConfig } from "vite";
import md from "unplugin-vue-markdown/vite";
import ssr from "vike/plugin";
import vue from "@vitejs/plugin-vue";

const config: UserConfig = {
  plugins: [
    ssr({ prerender: true }),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    md({}),
  ],
  // We manually add a list of dependencies to be pre-bundled, in order to avoid a page reload at dev start which breaks vike's CI
  optimizeDeps: { include: ["cross-fetch"] },
};

export default config;
