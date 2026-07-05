"use client";
import { useParams } from "next/navigation";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { useResourceItem } from "@/lib/admin/hooks";
import { Spinner, NotFoundState } from "@/components/admin/ui";
import type { Testimonial } from "@/lib/types";

export default function EditTestimonialPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useResourceItem<Testimonial>("testimonials", id);
  if (isLoading) return <Spinner />;
  if (isError || !data)
    return (
      <NotFoundState
        label="This testimonial no longer exists. It may have been deleted."
        backHref="/admin/testimonials"
        backLabel="Back to testimonials"
      />
    );
  return <TestimonialForm initial={data} />;
}
