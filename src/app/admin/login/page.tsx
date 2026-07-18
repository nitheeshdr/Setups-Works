import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

import { getSettings } from "@/lib/content";

export default async function AdminLoginPage() {
  const settings = await getSettings();

  return (
    <Suspense fallback={null}>
      <LoginForm logoLight={settings.logoLight} logoDark={settings.logoDark} />
    </Suspense>
  );
}
