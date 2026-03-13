import { NextResponse } from "next/server";
const youtube = require("youtube-search-api");

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Get 3 search results for the given query
    const result = await youtube.GetListByKeyword(query, false, 3, [{type: 'video'}]);
    
    if (result && result.items) {
      // Filter strictly for videos and take top 3
      const videos = result.items.filter(item => item.type === 'video').slice(0, 3);
      return NextResponse.json({ videos });
    } else {
      return NextResponse.json({ error: "No videos found" }, { status: 404 });
    }

  } catch (err) {
    console.error("YouTube search error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

