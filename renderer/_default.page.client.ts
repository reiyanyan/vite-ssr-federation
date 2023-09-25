import type { PageContext } from "./types";
import type { PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient } from "vike/types";
import { createApp } from "./app";
import { getPageTitle } from "./getPageTitle";

export const clientRouting = true;
export const prefetchStaticAssets = "viewport";
export { render };
export { onHydrationEnd };
export { onPageTransitionStart };
export { onPageTransitionEnd };

let app: ReturnType<typeof createApp>;
async function render(pageContext: PageContextBuiltInClient & PageContext) {
  if (!app) {
    app = createApp(pageContext);
    app.mount("#app");
  } else {
    app.changePage(pageContext);
  }
  document.title = getPageTitle(pageContext);
}

function onHydrationEnd() {
  console.log("Hydration finished; page is now interactive.");
}
function onPageTransitionStart() {
  console.log("Page transition start");
  document.querySelector("body")!.classList.add("page-is-transitioning");
}
function onPageTransitionEnd() {
  console.log("Page transition end");
  document.querySelector("body")!.classList.remove("page-is-transitioning");
}
