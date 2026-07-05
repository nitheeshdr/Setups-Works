"use client";
import { useParams } from "next/navigation";
import { BlogForm } from "@/components/admin/blog-form";
import { useResourceItem } from "@/lib/admin/hooks";
import { Spinner } from "@/components/admin/ui";
import type { Blog } from "@/lib/types";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useResourceItem<Blog>("blogs", id);
  if (isLoading || !data) return <Spinner />;
  return <BlogForm initial={data} />;
}
