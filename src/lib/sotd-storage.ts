export type Fragrance = {
  id: string;
  name: string;
  brand?: string;
  house?: string;
  notes?: string;
  createdAt: string;
};

export type TodayState = {
  date: string; // YYYY-MM-DD
  layers: 1 | 2;
  pickIds: string[];
  rolledAt: string;
  feedbackAt?: string; // ISO — when the journal unlocks
  timeIn?: string;
  journalId?: string;
};

export type JournalEntry = {
  id: string;
  date: string;
  fragranceIds: string[];
  occasion: string;
  feeling: string;
  rating: number;
  comment?: string;
  timeIn?: string;
  createdAt: string;
};

const K = {
  fragrances: "sotd:fragrances",
  today: "sotd:today",
  journal: "sotd:journal",
  occasions: "sotd:occasions",
};

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, val: T) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(val));
}

export const uid = () =>
  (isBrowser() && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2));

export const todayISO = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

// Fragrances
export const getFragrances = () => read<Fragrance[]>(K.fragrances, []);
export const saveFragrances = (list: Fragrance[]) => write(K.fragrances, list);

// Today
export const getToday = (): TodayState | null => {
  const t = read<TodayState | null>(K.today, null);
  if (!t) return null;
  if (t.date !== todayISO()) return null; // expired
  return t;
};
export const setToday = (t: TodayState | null) => write(K.today, t);

// Journal
export const getJournal = () => read<JournalEntry[]>(K.journal, []);
export const saveJournal = (list: JournalEntry[]) => write(K.journal, list);

// Occasions
export const getOccasions = () =>
  read<string[]>(K.occasions, ["Casual", "Work", "Evening", "Date Night", "Special Event"]);
export const saveOccasions = (list: string[]) => write(K.occasions, list);
