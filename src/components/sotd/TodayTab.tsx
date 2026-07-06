import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dices, Clock, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  getFragrances, getToday, setToday, todayISO, uid,
  getJournal, saveJournal, getOccasions, saveOccasions,
  type Fragrance, type TodayState,
} from "@/lib/sotd-storage";
import StarRating from "./StarRating";
import OccasionCombobox from "./OccasionCombobox";

function useTick() {
  const [, set] = useState(0);
  useEffect(() => {
    const t = setInterval(() => set((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function TodayTab() {
  useTick();
  const [collection, setCollection] = useState<Fragrance[]>([]);
  const [state, setState] = useState<TodayState | null>(null);
  const [layers, setLayers] = useState<1 | 2>(1);
  const [rolling, setRolling] = useState(false);
  const [shuffleName, setShuffleName] = useState("");

  // Journal form
  const [occasion, setOccasion] = useState("");
  const [feeling, setFeeling] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [occasions, setOccasions] = useState<string[]>([]);

  useEffect(() => {
    setCollection(getFragrances());
    setState(getToday());
    setOccasions(getOccasions());
  }, []);

  const picks = useMemo(() => {
    if (!state) return [];
    return state.pickIds
      .map((id) => collection.find((f) => f.id === id))
      .filter(Boolean) as Fragrance[];
  }, [state, collection]);

  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { setNow(new Date()); }, []);

  const roll = () => {
    if (collection.length < layers) {
      toast.error(`Need at least ${layers} fragrance${layers > 1 ? "s" : ""} to roll ${layers} layer${layers > 1 ? "s" : ""}.`);
      return;
    }
    setRolling(true);
    let ticks = 0;
    const shuffle = setInterval(() => {
      setShuffleName(collection[Math.floor(Math.random() * collection.length)].name);
      ticks++;
      if (ticks > 14) {
        clearInterval(shuffle);
        const pool = [...collection];
        const chosen: Fragrance[] = [];
        for (let i = 0; i < layers; i++) {
          const idx = Math.floor(Math.random() * pool.length);
          chosen.push(pool.splice(idx, 1)[0]);
        }
        const next: TodayState = {
          date: todayISO(),
          layers,
          pickIds: chosen.map((c) => c.id),
          rolledAt: new Date().toISOString(),
        };
        setState(next);
        setToday(next);
        setRolling(false);
        setShuffleName("");
      }
    }, 80);
  };

  const clockIn = () => {
    if (!state) return;
    const next: TodayState = { ...state, timeIn: new Date().toISOString() };
    setState(next);
    setToday(next);
    toast.success("Clocked in. The journal is unlocked.");
  };

  const existingEntry = useMemo(() => {
    if (!state?.journalId) return null;
    return getJournal().find((j) => j.id === state.journalId) ?? null;
  }, [state]);

  const saveEntry = () => {
    if (!state) return;
    if (!occasion.trim()) return toast.error("Pick an occasion.");
    if (!feeling.trim()) return toast.error("Share what you felt.");
    if (rating < 1) return toast.error("Give it a rating.");
    const entry = {
      id: uid(),
      date: state.date,
      fragranceIds: state.pickIds,
      occasion: occasion.trim(),
      feeling: feeling.trim(),
      rating,
      comment: comment.trim() || undefined,
      timeIn: state.timeIn,
      createdAt: new Date().toISOString(),
    };
    const list = [entry, ...getJournal()];
    saveJournal(list);
    const next = { ...state, journalId: entry.id };
    setState(next);
    setToday(next);
    toast.success("Journal entry saved.");
  };

  const addOccasion = (v: string) => {
    if (occasions.some((o) => o.toLowerCase() === v.toLowerCase())) return;
    const next = [...occasions, v];
    setOccasions(next);
    saveOccasions(next);
  };

  return (
    <div className="space-y-8">
      {/* Date / Time header */}
      <Card className="p-6 bg-gradient-to-br from-secondary to-background border-gold/20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Today</p>
            <p className="font-serif text-3xl mt-1">{now ? fmtDate(now.toISOString()) : ""}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Now</p>
            <p className="font-serif text-3xl mt-1 tabular-nums">
              {now ? now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : ""}
            </p>
          </div>
        </div>
      </Card>

      {/* Dice */}
      {!state ? (
        <Card className="p-8 text-center">
          <Dices className="mx-auto size-10 text-gold" />
          <h2 className="font-serif text-3xl mt-3">Let fate choose</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Roll the dice to reveal your scent for the day.
          </p>

          <div className="mt-6 flex justify-center gap-2">
            <Button
              variant={layers === 1 ? "default" : "outline"}
              onClick={() => setLayers(1)}
              disabled={rolling}
              className={layers === 1 ? "bg-primary" : ""}
            >
              1 Layer
            </Button>
            <Button
              variant={layers === 2 ? "default" : "outline"}
              onClick={() => setLayers(2)}
              disabled={rolling}
              className={layers === 2 ? "bg-primary" : ""}
            >
              2 Layers
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {layers === 1 ? "One fragrance for the day." : "Two fragrances, layered together."}
          </p>

          <div className="mt-6">
            {rolling ? (
              <div className="h-12 flex items-center justify-center font-serif text-2xl text-gold animate-pulse">
                {shuffleName}
              </div>
            ) : (
              <Button
                size="lg"
                onClick={roll}
                disabled={collection.length < layers}
                className="bg-gold hover:opacity-90 h-12 px-8 text-base"
              >
                <Dices /> Roll the dice
              </Button>
            )}
            {collection.length < layers && !rolling && (
              <p className="text-xs text-destructive mt-3">
                Add {layers - collection.length} more fragrance{layers - collection.length > 1 ? "s" : ""} to your collection first.
              </p>
            )}
          </div>
          <p className="mt-6 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Once rolled — accept the fate
          </p>
        </Card>
      ) : (
        <Card className="p-8 border-gold/40">
          <div className="flex items-center gap-2 justify-center text-gold">
            <Lock className="size-4" />
            <p className="text-[11px] uppercase tracking-[0.3em]">Fate accepted</p>
          </div>
          <h2 className="font-serif text-2xl text-center mt-2">
            {state.layers === 1 ? "Today you wear" : "Today you layer"}
          </h2>
          <div className={`mt-5 grid gap-3 ${picks.length > 1 ? "md:grid-cols-2" : ""}`}>
            {picks.map((f, i) => (
              <div key={f.id} className="text-center border border-gold/30 rounded-lg p-5 bg-secondary/40">
                {picks.length > 1 && (
                  <Badge variant="outline" className="mb-2 border-gold/40 text-gold">
                    Layer {i + 1}
                  </Badge>
                )}
                <p className="font-serif text-3xl">{f.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {f.brand || "—"}{f.house ? ` · ${f.house}` : ""}
                </p>
                {f.notes && <p className="mt-2 text-xs italic text-foreground/70">{f.notes}</p>}
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-muted-foreground mt-4">
            Rolled at {fmtTime(state.rolledAt)}
          </p>
        </Card>
      )}

      {/* Clock in */}
      {state && (
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-gold" />
                <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Time in</p>
              </div>
              <p className="font-serif text-2xl mt-1">
                {state.timeIn ? fmtTime(state.timeIn) : "Not clocked in yet"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {state.timeIn
                  ? "Journal unlocked. Come back later to write."
                  : "Spray on. Clock in to unlock the journal."}
              </p>
            </div>
            {!state.timeIn && (
              <Button onClick={clockIn} className="bg-primary">
                <Clock /> Clock in
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Journal */}
      {state?.timeIn && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="size-4 text-gold" />
            <h3 className="font-serif text-2xl">Today's journal</h3>
          </div>
          {existingEntry ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-gold">{existingEntry.occasion}</Badge>
                <StarRating value={existingEntry.rating} readOnly size={18} />
              </div>
              <p className="italic text-foreground/90">"{existingEntry.feeling}"</p>
              {existingEntry.comment && (
                <p className="text-sm text-muted-foreground">{existingEntry.comment}</p>
              )}
              <p className="text-xs text-muted-foreground pt-2 border-t">
                Saved at {fmtTime(existingEntry.createdAt)}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Occasion</Label>
                <OccasionCombobox
                  value={occasion}
                  onChange={setOccasion}
                  options={occasions}
                  onCreate={addOccasion}
                />
              </div>
              <div className="space-y-2">
                <Label>What did you feel about this fragrance?</Label>
                <Textarea
                  rows={3}
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                  placeholder="It opens sharp then softens into something warm..."
                />
              </div>
              <div className="space-y-2">
                <Label>Rate this</Label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div className="space-y-2">
                <Label>Comment (optional)</Label>
                <Textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Compliments received, longevity, projection..."
                />
              </div>
              <Button onClick={saveEntry} className="bg-gold w-full">
                Save entry
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
