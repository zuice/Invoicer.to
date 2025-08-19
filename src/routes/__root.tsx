/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import appCss from "@/styles/app.css?url";
import { seo } from "@/utils/seo";
import { NotFound } from "@/components/NotFound";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        ...seo({
          title: "Invoicer.to",
          description: "Track, manage, and create invoices all in one place.",
        }),
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
        { rel: "icon", href: "/favicon.ico" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Invoicer.to",
            description:
              "Track, manage, and create invoices all in one place. Free and secure.",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: "https://invoicer.to",
          }),
        },
      ],
    }),
    errorComponent: DefaultCatchBoundary,
    notFoundComponent: () => <NotFound />,
    shellComponent: RootDocument,
  },
);

function RootDocument() {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="h-svh w-svw flex flex-col">
        <hr />
        <Outlet />
        <Toaster richColors />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
