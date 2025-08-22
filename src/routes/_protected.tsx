import { Outlet, createFileRoute } from "@tanstack/react-router";

import { Nav } from "@/components/Nav";
import { getAuthFn2 } from "@/features/auth/server/getAuthFn2";
import { meQueryOptions } from "@/features/auth/server/getMeFn";

export const Route = createFileRoute("/_protected")({
  beforeLoad: () => getAuthFn2(),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(meQueryOptions());

    return context.user;
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Nav />
      <div className="container mx-auto flex flex-col gap-4 mt-4">
        <Outlet />
      </div>
    </>
  );
}
