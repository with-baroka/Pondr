"use client";

import { useState } from "react";
import type { Item } from "@/types";
import { createClient } from "@/lib/supabase/client";
import ReadyItemCard from "@/components/items/ReadyItemCard";
import WaitingItemCard from "@/components/items/WaitingItemCard";
import ItemDetailModal from "@/components/items/ItemDetailModal";


interface ItemsBoardProps {
  initialItems: Item[];
}

export default function ItemsBoard({ initialItems }: ItemsBoardProps) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [open, setOpen] = useState<{ id: string; now: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const readyItems = items.filter((item) => item.status === "ready");
  const waitingItems = items.filter((item) => item.status === "waiting");

  const openItem = open ? items.find((item) => item.id === open.id) : undefined;

  function handleOpen(id: string) {
    setActionError("");
    setOpen({ id, now: Date.now() });
  }

  async function handleSkipWait(id: string) {
    if (isSaving) return;

    setIsSaving(true);
    setActionError("");

    try {
      const supabase = createClient();
      const reviewAt = new Date().toISOString();

      const { error } = await supabase
        .from("items")
        .update({
          status: "ready",
          review_at: reviewAt,
        })
        .eq("id", id);
        
        if (error) throw error;

        setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: "ready", reviewAt }
            : item,
        ),
      );

      setOpen(null);
    } catch (error){
      console.error("Failed to skip wait:", error);
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to update item.",
      );
    } finally {
      setIsSaving(false);
    }

    
  }

  async function handleDelete(id: string) {
    if (isSaving) return;

    setIsSaving(true);
    setActionError("");

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", id);
      
      if (error) throw error;

      setItems((prev) => prev.filter((item) => item.id !== id));
      setOpen(null);
    } catch (error){
      console.error("Failed to delete item: ", error);
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to delete item.", 
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {actionError}
        </div>
      )}

      {/* Ready to review */}
      {readyItems.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-semibold text-gray-900">
              Ready to review
            </h2>
            <span className="text-xs text-gray-500">
              {readyItems.length} items
            </span>
          </div>

          <div className="space-y-3">
            {readyItems.map((item) => (
              <ReadyItemCard
                key={item.id}
                item={item}
                onOpen={() => handleOpen(item.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Waiting */}
      {waitingItems.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-semibold text-gray-900">
              Waiting
            </h2>
            <span className="text-xs text-gray-500">
              {waitingItems.length} items
            </span>
          </div>

          <div className="space-y-3">
            {waitingItems.map((item) => (
              <WaitingItemCard
                key={item.id}
                item={item}
                onOpen={() => handleOpen(item.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {readyItems.length === 0 && waitingItems.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
          <h2 className="font-medium text-gray-900">
            Nothing here yet
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Add something to your wishlist and take your time deciding.
          </p>
        </div>
      )}

      {open && openItem && (
        <ItemDetailModal
          key={openItem.id}
          item={openItem}
          now={open.now}
          onClose={() => setOpen(null)}
          onSkipWait={handleSkipWait}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}