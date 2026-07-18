import type { ReactNode } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/shell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

import { getSettings } from "@/lib/content";

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/admin/login");

  const settings = await getSettings();

  return (
    <AdminShell user={user} logoLight={settings.logoLight} logoDark={settings.logoDark}>
      {children}
    </AdminShell>
  );
}
