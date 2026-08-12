"use client";
import { useParams } from "next/navigation";
import { TeamForm } from "@/components/admin/team-form";
import { useResourceItem } from "@/lib/admin/hooks";
import { Spinner, NotFoundState } from "@/components/admin/ui";
import type { TeamMember } from "@/lib/types";

export default function EditTeamMemberPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useResourceItem<TeamMember>("team", id);
  if (isLoading) return <Spinner />;
  if (isError || !data)
    return (
      <NotFoundState
        label="This team member no longer exists. They may have been deleted."
        backHref="/admin/team"
        backLabel="Back to team"
      />
    );
  return <TeamForm initial={data} />;
}
