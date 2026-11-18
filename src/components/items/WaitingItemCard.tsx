"use client";

import { useEffect, useState } from "react";
import type { Item } from "@/types";
import { TRIGGER_LABELS, TRIGGER_COLORS } from "@/utils/item-labels";
import { formatDaysLeft, getWaitProgress } from "@/lib/waiting-days";
import { Box } from "lucide-react";

interface WaitingItemCardProps {
  item: Item;
  onOpen: () => void;
}

export default function WaitingItemCard({
  item,
  onOpen,
}: WaitingItemCardProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
  }, []);

  const wait = now === null ? null : getWaitProgress(item, now);

  return (
    <div className="relative flex min-h-36 overflow-hidden rounded-2xl border bg-gray-50 border-gray-200 transition hover:border-gray-300">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View details for ${item.name}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      />

      {/* Left: Product image */}
      <div className="flex w-1/3 shrink-0 self-stretch p-2 pb-0 sm:h-36 sm:w-[28%] sm:self-center sm:p-4 sm:pb-0">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full rounded-t-lg object-cover"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center rounded-t-lg ${
              TRIGGER_COLORS[item.trigger].bg
            }`}
          >
            <Box
              size={32}
              strokeWidth={1.5}
              className={TRIGGER_COLORS[item.trigger].text}
            />
          </div>
        )}
      </div>

      {/* Right: Item information and timer */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-gray-900">{item.name}</h3>

            <p className="shrink-0 text-sm font-medium text-gray-700">
              Rp {item.price.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs ${
                TRIGGER_COLORS[item.trigger].bg
              } ${TRIGGER_COLORS[item.trigger].text}`}
            >
              {TRIGGER_LABELS[item.trigger]}
            </span>

            <span className="text-xs text-gray-400">
              {wait === null ? " " : formatDaysLeft(wait.daysLeft)}
            </span>
          </div>
        </div>

        <div>
          <div className="mb-2 flex justify-between text-xs text-gray-400">
            <span>Waiting progress</span>
            <span>{Math.round(wait?.progress ?? 0)}%</span>
          </div>

          <div
            role="progressbar"
            aria-label="Waiting progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(wait?.progress ?? 0)}
            className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
          >
            <div
              className="h-full rounded-full bg-zinc-900"
              style={{ width: `${wait?.progress ?? 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
