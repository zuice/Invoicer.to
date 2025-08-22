import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/complete-profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProfileForm />;
}
