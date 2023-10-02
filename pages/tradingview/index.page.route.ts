import { resolveRoute } from "vike/routing";

// We use a Route Function to implement advanced routing logic
export default (pageContext: { urlPathname: string }) => {
  const path = pageContext.urlPathname;

  if (["/tradingview", "/tradingview/"].includes(path)) {
    return {
      routeParams: {
        coin: "BTC-USDT",
      },
    };
  }

  return resolveRoute("/tradingview/@coin", pageContext.urlPathname);
};
