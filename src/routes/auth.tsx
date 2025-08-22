import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center bg-gray-50 px-4">
      <Outlet />
    </div>
  );
}
