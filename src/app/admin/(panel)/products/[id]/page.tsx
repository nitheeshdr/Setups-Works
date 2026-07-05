"use client";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { useResourceItem } from "@/lib/admin/hooks";
import { Spinner, NotFoundState } from "@/components/admin/ui";
import type { Product } from "@/lib/types";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useResourceItem<Product>("products", id);
  if (isLoading) return <Spinner />;
  if (isError || !data)
    return (
      <NotFoundState
        label="This product no longer exists. It may have been deleted."
        backHref="/admin/products"
        backLabel="Back to products"
      />
    );
  return <ProductForm initial={data} />;
}
