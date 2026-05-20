"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CompleteSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    await fetch(`/api/sessions/${sessionId}/complete`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <Button
      size="sm"
      className="bg-green-600 hover:bg-green-700"
      onClick={handleComplete}
      disabled={loading}
    >
      {loading ? "..." : "✓ Marquer comme fait"}
    </Button>
  );
}
