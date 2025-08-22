import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { profileQueryOptions } from "@/features/profile/server/getProfileFn";
import { Heading } from "@/components/Heading";

export const Route = createFileRoute("/_protected/settings")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(profileQueryOptions()),
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useQuery(profileQueryOptions());

  return (
    <>
      <Heading title="Profile" description="Start editing your profile here." />
      <ProfileForm {...data} />
    </>
  );
}
