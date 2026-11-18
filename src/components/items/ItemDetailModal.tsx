"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { Item } from "@/types";
import { TRIGGER_LABELS, TRIGGER_COLORS } from "@/utils/item-labels";
import { formatDaysLeft, getWaitProgress } from "@/lib/waiting-days";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

type Confirm = "urgent" | "delete" | null;

interface ItemDetailModalProps {
  item: Item;
  now: number;
  onClose: () => void;
  onSkipWait: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ItemDetailModal({
  item,
  now,
  onClose,
  onSkipWait,
  onDelete,
}: ItemDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [confirm, setConfirm] = useState<Confirm>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const isReady = item.status === "ready";
  const price = `Rp ${item.price.toLocaleString("id-ID")}`;

  const { daysLeft, progress } = getWaitProgress(item, now);

  const secondaryButton =
    "rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 transition hover:border-gray-400";

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      aria-labelledby="item-modal-title"
      className="m-auto max-h-[85vh] w-[calc(100%-2.5rem)] max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-1 text-gray-900 shadow-lg backdrop:bg-zinc-900/40"
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <X size={20} />
        </button>

        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-48 w-full rounded-xl object-cover"
          />
        )}

        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="pr-8">
            <p className="text-sm text-gray-500">
              {isReady ? "Ready to review" : "Waiting"}
            </p>
            <h2
              id="item-modal-title"
              className="text-2xl font-semibold tracking-tight text-gray-900"
            >
              {item.name}
            </h2>
            <p className="mt-1 text-sm text-gray-400">{price}</p>
          </div>

          {/* Wait status */}
          <section>
            {!isReady && (
              <>
                <p className="mb-2 text-sm text-gray-600">
                  {formatDaysLeft(daysLeft)}
                </p>
                <div
                  role="progressbar"
                  aria-label="Waiting progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                  className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
                >
                  <div
                    className="h-full rounded-full bg-zinc-900"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            )}

            <dl className={`${isReady ? "" : "mt-4 "}space-y-1 text-sm`}>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Added</dt>
                <dd className="text-gray-900">{formatDate(item.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">
                  {isReady ? "Ready since" : "Ready on"}
                </dt>
                <dd className="text-gray-900">{formatDate(item.reviewAt)}</dd>
              </div>
            </dl>
          </section>

          {/* Why */}
          <section className="space-y-2 border-t border-gray-100 pt-5">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs ${
                TRIGGER_COLORS[item.trigger].bg
              } ${TRIGGER_COLORS[item.trigger].text}`}
            >
              {TRIGGER_LABELS[item.trigger]}
            </span>
            {item.reason && (
              <p className="text-sm text-gray-500">
                You wrote: “{item.reason}”
              </p>
            )}
          </section>

          {/* Actions */}
          <section className="space-y-3">
            {isReady && (
              <Link
                href={`/items/${item.id}/check-in`}
                className="block w-full rounded-xl bg-zinc-900 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-zinc-700"
              >
                Check in
              </Link>
            )}

            {confirm === null && (
              <div className="flex items-center justify-between">
                {!isReady ? (
                  <button
                    type="button"
                    onClick={() => setConfirm("urgent")}
                    className="text-sm text-gray-600 underline hover:text-gray-900"
                  >
                    It became urgent
                  </button>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  onClick={() => setConfirm("delete")}
                  className="text-sm text-red-600 underline hover:text-red-800"
                >
                  Delete from list
                </button>
              </div>
            )}

            {confirm === "urgent" && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-900">
                  Skip the rest of your wait?
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  This item moves to Ready to review, and you can check in right
                  away.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirm(null)}
                    className={secondaryButton}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => onSkipWait(item.id)}
                    className="rounded-xl bg-zinc-900 px-3 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
                  >
                    Skip wait
                  </button>
                </div>
              </div>
            )}

            {confirm === "delete" && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-900">
                  Delete this item?
                </p>
                <p className="mt-1 text-sm text-red-700">
                  It&apos;s removed from your list and won&apos;t count as money
                  saved.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirm(null)}
                    className={secondaryButton}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="rounded-xl bg-red-600 px-3 py-3 text-sm font-medium text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </dialog>
  );
}
