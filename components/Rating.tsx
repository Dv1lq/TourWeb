import { Star } from "lucide-react";

export function Rating({ value, reviews }: { value: number; reviews?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800">
      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
      {value.toFixed(1)}
      {typeof reviews === "number" ? <span className="font-normal text-slate-500">({reviews})</span> : null}
    </span>
  );
}
