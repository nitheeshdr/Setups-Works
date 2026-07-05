"use client";
import { useParams } from "next/navigation";
import { PortfolioForm } from "@/components/admin/portfolio-form";
import { useResourceItem } from "@/lib/admin/hooks";
import { Spinner } from "@/components/admin/ui";
import type { Portfolio } from "@/lib/types";

export default function EditPortfolioPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useResourceItem<Portfolio>("portfolio", id);
  if (isLoading || !data) return <Spinner />;
  return <PortfolioForm initial={data} />;
}
