"use client";
import { useParams } from "next/navigation";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { useResourceItem } from "@/lib/admin/hooks";
import { Spinner } from "@/components/admin/ui";
import type { Testimonial } from "@/lib/types";

export default function EditTestimonialPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useResourceItem<Testimonial>("testimonials", id);
  if (isLoading || !data) return <Spinner />;
  return <TestimonialForm initial={data} />;
}
