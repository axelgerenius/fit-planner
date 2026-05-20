"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function GenerateShoppingListButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    await fetch("/api/shopping/generate", { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <Button className="bg-green-600 hover:bg-green-700" onClick={generate} disabled={loading}>
      {loading ? "Génération..." : "Générer la liste"}
    </Button>
  );
}
