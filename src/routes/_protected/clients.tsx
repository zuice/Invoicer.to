import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/clients")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_protected/clients"!</div>;
}
