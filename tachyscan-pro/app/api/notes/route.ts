export const dynamic = "force-dynamic";

const NOTE_RSS_URL = "https://note.com/holy_vole8749/rss";

function extractTag(item: string, tag: string) {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match?.[1]
    ?.replace("<![CDATA[", "")
    ?.replace("]]>", "")
    ?.trim();
}

export async function GET() {
  const res = await fetch(NOTE_RSS_URL, {
    cache: "no-store",
  });

  const xml = await res.text();

  const items = xml
    .split("<item>")
    .slice(1)
    .map((item) => ({
      title: extractTag(item, "title") ?? "No title",
      link: extractTag(item, "link") ?? "",
      pubDate: extractTag(item, "pubDate") ?? "",
    }))
    .slice(0, 5);

  return Response.json(items);
}