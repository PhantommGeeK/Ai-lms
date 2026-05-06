import { NextResponse } from "next/server";

function extractYouTubeInitialData(html) {
  const patterns = [
    /var ytInitialData = (.*?);<\/script>/s,
    /window\["ytInitialData"\] = (.*?);<\/script>/s,
    /ytInitialData"\]\s*=\s*(.*?);<\/script>/s,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return JSON.parse(match[1]);
    }
  }

  throw new Error("Unable to parse YouTube search response.");
}

function collectVideoRenderers(node, results = []) {
  if (!node || typeof node !== "object") return results;

  if (Array.isArray(node)) {
    for (const item of node) {
      collectVideoRenderers(item, results);
    }
    return results;
  }

  if (node.videoRenderer) {
    results.push(node.videoRenderer);
  }

  for (const value of Object.values(node)) {
    collectVideoRenderers(value, results);
  }

  return results;
}

function mapVideo(videoRenderer) {
  const title =
    videoRenderer?.title?.runs?.map((item) => item.text).join("") ||
    videoRenderer?.title?.simpleText ||
    "YouTube video";

  return {
    id: videoRenderer?.videoId,
    title,
  };
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const response = await fetch(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%253D%253D`,
      {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "accept-language": "en-US,en;q=0.9",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`YouTube request failed with status ${response.status}`);
    }

    const html = await response.text();
    const initialData = extractYouTubeInitialData(html);
    const videos = collectVideoRenderers(initialData)
      .map(mapVideo)
      .filter((video) => video.id)
      .slice(0, 3);

    if (videos.length === 0) {
      return NextResponse.json({ error: "No videos found" }, { status: 404 });
    }

    return NextResponse.json({ videos });

  } catch (err) {
    console.error("YouTube search error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
