import type { PageContext } from "./types";
import type { PageContextBuiltInServer } from "vike/types";
import { createApp } from "./app";
import { escapeInject } from "vike/server";
import { getPageTitle } from "./getPageTitle";
import { renderToNodeStream } from "@vue/server-renderer";

export { passToClient };
export { render };

const passToClient = ["pageProps", "documentProps"];

async function render(pageContext: PageContextBuiltInServer & PageContext) {
  const app = createApp(pageContext);
  const stream = renderToNodeStream(app);

  const title = getPageTitle(pageContext);

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <script src="/datafeeds/udf/bundle.js"></script>
      </head>
      <body>
        <div id="app">${stream}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true,
    },
  };
}
