import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import CollectionTab from "@/components/sotd/CollectionTab";
import TodayTab from "@/components/sotd/TodayTab";
import JournalTab from "@/components/sotd/JournalTab";

export default function App() {
  const [tab, setTab] = useState("today");
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col items-center text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            A daily fragrance ritual
          </p>
          <h1 className="font-serif text-5xl md:text-6xl mt-2 text-foreground">
            Scent<span className="text-gold">of</span>theDay
          </h1>
          <div className="mt-3 h-px w-16 bg-gold/60" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mx-auto grid grid-cols-3 w-full max-w-md bg-secondary">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="collection">Collection</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="mt-8">
            <TodayTab />
          </TabsContent>
          <TabsContent value="collection" className="mt-8">
            <CollectionTab />
          </TabsContent>
          <TabsContent value="journal" className="mt-8">
            <JournalTab />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mx-auto max-w-5xl px-6 py-10 text-center text-xs text-muted-foreground">
        Accept the fate. Wear it well.
      </footer>
      <Toaster />
    </div>
  );
}
