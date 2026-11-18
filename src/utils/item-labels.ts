import type { ItemTrigger } from "@/types";

export const TRIGGER_LABELS: Record<ItemTrigger, string> = {
  need: "I need it",
  upgrade: "I want to upgrade",
  like: "I simply like it",
  self_reward: "I want to reward myself",
  influenced: "Someone influenced me",
  discount: "It's on sale",
  investment: "It's an investment",
};

export const TRIGGER_COLORS: Record<
  ItemTrigger,
  { bg: string; text: string }
> = {
  need: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
  },
  upgrade: {
    bg: "bg-sky-100",
    text: "text-sky-800",
  },
  like: {
    bg: "bg-pink-100",
    text: "text-pink-800",
  },
  self_reward: {
    bg: "bg-violet-100",
    text: "text-violet-800",
  },
  influenced: {
    bg: "bg-amber-100",
    text: "text-amber-800",
  },
  discount: {
    bg: "bg-orange-100",
    text: "text-orange-800",
  },
  investment: {
    bg: "bg-stone-100",
    text: "text-stone-800",
  },
};
