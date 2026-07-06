import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Globe } from "lucide-react";
import { toast } from "sonner";
import {
  type Fragrance, getFragrances, saveFragrances, uid,
} from "@/lib/sotd-storage";
import { scrapeFromUrl } from "@/lib/scraper";

function emptyFrag(): Omit<Fragrance, "id" | "createdAt"> {
  return { name: "", brand: "", notes: "" };
}

export default function CollectionTab() {
  const [list, setList] = useState<Fragrance[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Fragrance | null>(null);
  const [form, setForm] = useState<Omit<Fragrance, "id" | "createdAt">>(emptyFrag());
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState("");

  useEffect(() => setList(getFragrances()), []);

  const persist = (next: Fragrance[]) => {
    setList(next);
    saveFragrances(next);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyFrag());
    setImportUrl("");
    setOpen(true);
  };
  const openEdit = (f: Fragrance) => {
    setEditing(f);
    setForm({ name: f.name, brand: f.brand ?? "", notes: f.notes ?? "" });
    setImportUrl("");
    setOpen(true);
  };

  const importFromUrl = async () => {
    if (!importUrl.trim()) {
      toast.error("Paste a fragrance URL first");
      return;
    }
    setImporting(true);
    setImportStatus("Importing...");
    try {
      const data = await scrapeFromUrl(importUrl.trim());
      setForm({
        name: data.name || "",
        brand: data.brand || "",
        notes: data.notes || "",
      });
      setImportStatus("Imported!");
      toast.success("Imported from URL");
    } catch {
      setImportStatus("Failed to import");
      toast.error("Could not scrape that URL. Try a Fragrantica, Parfumo, or Basenotes link.");
    } finally {
      setImporting(false);
      setTimeout(() => setImportStatus(""), 2000);
    }
  };

  const save = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const payload = { name: form.name, brand: form.brand, notes: form.notes };
    if (editing) {
      persist(list.map((f) => (f.id === editing.id ? { ...f, ...payload } : f)));
      toast.success("Fragrance updated");
    } else {
      persist([
        { id: uid(), createdAt: new Date().toISOString(), ...payload },
        ...list,
      ]);
      toast.success("Fragrance added");
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    persist(list.filter((f) => f.id !== id));
    toast.success("Removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl">Your Collection</h2>
          <p className="text-sm text-muted-foreground">
            {list.length} {list.length === 1 ? "fragrance" : "fragrances"} in your wardrobe
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd} className="bg-gold hover:opacity-90">
              <Plus /> Add fragrance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">
                {editing ? "Edit fragrance" : "New fragrance"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {!editing && (
                <div>
                  <div className="flex gap-2">
                    <Input
                      value={importUrl}
                      onChange={(e) => setImportUrl(e.target.value)}
                      placeholder="Paste Fragrantica / Parfumo URL..."
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={importFromUrl}
                      disabled={importing}
                    >
                      <Globe className={importing ? "animate-spin" : ""} />
                      {importing ? "..." : "Import"}
                    </Button>
                  </div>
                  {importStatus && (
                    <p className="text-xs text-muted-foreground mt-1">{importStatus}</p>
                  )}
                </div>
              )}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Sauvage Elixir"
                />
              </div>
              <div className="space-y-2">
                <Label>Brand</Label>
                <Input
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="Dior"
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Top notes, heart notes, base notes..."
                  rows={3}
                />
              </div>
            </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} className="bg-gold">
                {editing ? "Save changes" : "Add to collection"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {list.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <p className="font-serif text-2xl mb-2">Your wardrobe is empty</p>
          <p className="text-sm text-muted-foreground mb-6">
            Add your first fragrance to begin the ritual.
          </p>
          <Button onClick={openAdd} className="bg-gold">
            <Plus /> Add fragrance
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((f) => (
            <Card key={f.id} className="p-5 group hover:border-gold/60 transition">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-serif text-2xl leading-tight truncate">{f.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {f.brand || "—"}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(f)}>
                    <Pencil />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Trash2 />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove {f.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This can't be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(f.id)}>
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              {f.notes && (
                <p className="mt-3 text-sm text-foreground/80 italic border-l-2 border-gold/60 pl-3">
                  {f.notes}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
