"use client";
import { useParams } from "next/navigation";
import { PortfolioForm } from "@/components/admin/portfolio-form";
import { useResourceItem } from "@/lib/admin/hooks";
import { Spinner, NotFoundState } from "@/components/admin/ui";
import type { Portfolio } from "@/lib/types";

export default function EditPortfolioPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useResourceItem<Portfolio>("portfolio", id);
  if (isLoading) return <Spinner />;
  if (isError || !data)
    return (
      <NotFoundState
        label="This project no longer exists. It may have been deleted."
        backHref="/admin/portfolio"
        backLabel="Back to projects"
      />
    );
  return <PortfolioForm initial={data} />;
}
