import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Item } from "@/types";

import ItemsBoard from "@/components/items/ItemsBoard";

async function ItemsContent() {
  await connection();
  const supabase = await createClient();

  // get the currently logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user){
    redirect("/login");
  }

  // check if item ready
  const { error: readyError } = await supabase
    .from("items")
    .update({ status: "ready" })
    .eq("user_id", user.id)
    .eq("status", "waiting")
    .lte("review_at", new Date().toISOString());

  if (readyError) {
    console.error("Failed to mark due items as ready: ", readyError);
  }

  // fetch hanya item milik user saja
  const { data, error } = await supabase
    .from("items")
    .select(
      "id, name, price, trigger, reason, image_url, created_at, review_at, status",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

    if (error){
      console.error("Failed to fetch items: ", error);
      throw new Error("Failed to load your items");
    }

    // convert format snake_case supabase ke fromat yang digunakan dalam Pondr (camelCase)
    const items: Item[] = (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      price: Number(row.price),
      trigger: row.trigger as Item["trigger"],
      reason: row.reason ?? undefined,
      imageUrl: row.image_url ?? undefined,
      createdAt: row.created_at,
      reviewAt: row.review_at,
      status: row.status as Item["status"],
    }));
  return <ItemsBoard initialItems={items} />;
}

export default function Home() {
  return (
    <main className="min-h-screen px-5 py-10 pb-28">
      <div className="mx-auto max-w-xl space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            My items
          </h1>
        </div>

        <Suspense
          fallback={<p className="text-sm text-gray-500">Loading...</p>}
        >
          <ItemsContent />
        </Suspense>
      </div>
    </main>
  );
}