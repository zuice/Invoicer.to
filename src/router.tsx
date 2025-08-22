import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { BProgress } from "@bprogress/core";

import { routeTree } from "@/routeTree.gen";

export function createRouter() {
  const queryClient = new QueryClient();
  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  router.subscribe("onBeforeLoad", ({ fromLocation, pathChanged }) => {
    // Don't show the progress bar on initial page load, seems like the onLoad event doesn't fire in that case
    fromLocation && pathChanged && BProgress.start();
  });
  router.subscribe("onLoad", () => {
    BProgress.done();
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
