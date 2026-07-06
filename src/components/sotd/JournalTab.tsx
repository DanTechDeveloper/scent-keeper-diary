import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import StarRating from "./StarRating";
import {
  getFragrances, getJournal, type Fragrance, type JournalEntry,
} from "@/lib/sotd-storage";

export default function JournalTab() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [frags, setFrags] = useState<Fragrance[]>([]);

  useEffect(() => {
    setEntries(getJournal());
    setFrags(getFragrances());
  }, []);

  const byId = Object.fromEntries(frags.map((f) => [f.id, f]));

  if (entries.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed">
        <BookOpen className="mx-auto size-8 text-gold" />
        <p className="font-serif text-2xl mt-3">No entries yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Roll today's scent, clock in, and write your first entry.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl">Journal</h2>
        <p className="text-sm text-muted-foreground">
          {entries.length} {entries.length === 1 ? "memory" : "memories"} recorded
        </p>
      </div>
      <div className="space-y-4">
        {entries.map((e) => {
          const names = e.fragranceIds.map((id) => byId[id]?.name ?? "Removed fragrance");
          return (
            <Card key={e.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                    {new Date(e.date).toLocaleDateString(undefined, {
                      weekday: "short", month: "long", day: "numeric", year: "numeric",
                    })}
                    {e.timeIn && ` · ${new Date(e.timeIn).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`}
                  </p>
                  <p className="font-serif text-2xl mt-1">
                    {names.join(" × ")}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className="bg-gold">{e.occasion}</Badge>
                  <StarRating value={e.rating} readOnly size={16} />
                </div>
              </div>
              <p className="mt-3 italic text-foreground/90 border-l-2 border-gold/60 pl-3">
                "{e.feeling}"
              </p>
              {e.comment && (
                <p className="mt-2 text-sm text-muted-foreground">{e.comment}</p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
