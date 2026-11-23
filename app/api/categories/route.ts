import { NextResponse } from "next/server";
import { getCategories } from "@/lib/categories";

export async function GET() {
  try {
    return NextResponse.json({
      categories: getCategories(),
    });
  } catch (error) {
    console.error("Categories API error:", error);

    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 },
    );
  }
}
