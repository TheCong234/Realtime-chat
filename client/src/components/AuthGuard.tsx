// components/AuthGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.replace("/login?reason=unauthorized");
      return;
    }

    setChecked(true);
  }, [router]);

  // ⛔ tránh flash UI
  if (!checked) return null;

  return <>{children}</>;
}
