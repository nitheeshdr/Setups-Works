"use client";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { useResourceItem } from "@/lib/admin/hooks";
import { Spinner } from "@/components/admin/ui";
import type { Product } from "@/lib/types";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useResourceItem<Product>("products", id);
  if (isLoading || !data) return <Spinner />;
  return <ProductForm initial={data} />;
}
