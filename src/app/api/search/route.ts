import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SearchHistory from "@/lib/models/SearchModel";

// Connect to the database

// GET request: Fetch suggestions based on the query
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }
  await dbConnect();

  try {
    const results = await SearchHistory.find({
      term: { $regex: query, $options: "i" },
    }).limit(5); // Limit results for performance

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching search history" },
      { status: 500 }
    );
  }
};

// POST request: Save a new search term or increment the count if it exists
export const POST = async (req: Request) => {
  const { query } = await req.json();

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }
  await dbConnect();

  try {
    // Upsert the search term
    await SearchHistory.findOneAndUpdate(
      { term: query },
      {
        // Increment count by 1, and update lastSearchedAt
        $inc: { count: 1 },
        lastSearchedAt: Date.now(), // Update last searched time
      },
      { upsert: true }
    );

    return NextResponse.json({ message: "Search term saved" }, { status: 200 });
  } catch (error) {
    console.log("there was an error post search ", error);
    return NextResponse.json(
      { error: "Error saving search term" },
      { status: 500 }
    );
  }
};
