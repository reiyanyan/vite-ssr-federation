// export const title = "TradingView - Test";

import type { PageContextBuiltInServer } from "vike/types";
// import { RenderErrorPage } from "vike/RenderErrorPage";

async function onBeforeRender(pageContext: PageContextBuiltInServer) {
  const { coin } = pageContext.routeParams;
  // if (name !== "unknownCode") {
  //   const errorDescription = `Unknown code: ${name}.`;
  //   throw RenderErrorPage({ pageContext: { pageProps: { errorDescription } } });
  // }
  //   const pageProps = { coin };
  return {
    pageContext: {
      pageProps: {
        coin,
      },
      documentProps: {
        title: `TradingView - ${coin}`,
      },
    },
  };
}

function prerender(): string[] {
  return [
    "/tradingview",
    // ...["BTC-USDT", "SHIB-USDT", "ETH-USDT"].map((v) => `/tradingview/${v}`),
  ];
}

export { onBeforeRender };
export { prerender };
