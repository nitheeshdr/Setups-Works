"use client";
import { useParams } from "next/navigation";
import { BlogForm } from "@/components/admin/blog-form";
import { useResourceItem } from "@/lib/admin/hooks";
import { Spinner, NotFoundState } from "@/components/admin/ui";
import type { Blog } from "@/lib/types";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useResourceItem<Blog>("blogs", id);
  if (isLoading) return <Spinner />;
  if (isError || !data)
    return (
      <NotFoundState
        label="This post no longer exists. It may have been deleted."
        backHref="/admin/blogs"
        backLabel="Back to posts"
      />
    );
  return <BlogForm initial={data} />;
}
