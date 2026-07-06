type Scraped = {
  name: string;
  brand: string;
  notes: string;
};

function parseUrlForName(url: string): string {
  try {
    const path = new URL(url).pathname;
    const parts = path.split("/").filter(Boolean);
    const last = parts[parts.length - 1]?.replace(/\.html?$/, "") ?? "";
    return last.replace(/[-_]/g, " ").replace(/\s+\d+$/, "").trim();
  } catch {
    return "";
  }
}

function extractBrandFromUrl(url: string): string {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    return parts[1] ?? "";
  } catch {
    return "";
  }
}

export async function scrapeFromUrl(url: string): Promise<Scraped> {
  const perfumeName = parseUrlForName(url);
  const brand = extractBrandFromUrl(url);
  return { name: perfumeName, brand, notes: "" };
}
