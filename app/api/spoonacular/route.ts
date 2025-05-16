import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ingredients } = body;

    if (!ingredients || typeof ingredients !== "string") {
      return NextResponse.json(
        { message: "Invalid ingredients input" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "API key not configured" },
        { status: 500 }
      );
    }

    const spoonacularRes = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
        ingredients
      )}&number=8&ranking=1&ignorePantry=true&apiKey=${apiKey}`
    );

    if (!spoonacularRes.ok) {
      return NextResponse.json(
        { message: "Failed to fetch from Spoonacular" },
        { status: spoonacularRes.status }
      );
    }

    const data = await spoonacularRes.json();
    console.log("Spoonacular API response:", data);
    const filteredData = data.filter(
      (recipe: any) => recipe.missedIngredientCount == 0
    );
    return NextResponse.json(filteredData, { status: 200 });
  } catch (error) {
    console.error("Error calling Spoonacular API:", error);
    return NextResponse.json(
      { message: "Internal server error Bob ross" },
      { status: 500 }
    );
  }
}
