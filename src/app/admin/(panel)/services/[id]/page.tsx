"use client";
import { useParams } from "next/navigation";
import { ServiceForm } from "@/components/admin/service-form";
import { useResourceItem } from "@/lib/admin/hooks";
import { Spinner, NotFoundState } from "@/components/admin/ui";
import type { Service } from "@/lib/types";

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useResourceItem<Service>("services", id);
  if (isLoading) return <Spinner />;
  if (isError || !data)
    return (
      <NotFoundState
        label="This service no longer exists. It may have been deleted."
        backHref="/admin/services"
        backLabel="Back to services"
      />
    );
  return <ServiceForm initial={data} />;
}
