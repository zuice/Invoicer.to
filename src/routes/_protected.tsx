import { Outlet, useLoaderData, createFileRoute } from "@tanstack/react-router";

import { getAuthFn } from "@/features/auth/server/getAuthFn";
import { Nav } from "@/components/Nav";

export const Route = createFileRoute("/_protected")({
  beforeLoad: () => getAuthFn(),
  loader: ({ context }) => context.user,
  component: RouteComponent,
});

function RouteComponent() {
  const user = useLoaderData({ from: "/_protected" });

  return (
    <>
      <Nav user={user} />
      <div className="container mx-auto">
        <Outlet />
      </div>
    </>
  );
}
