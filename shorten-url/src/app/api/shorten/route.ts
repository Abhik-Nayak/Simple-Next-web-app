// src/app/api/shorten/route.ts
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import Url from "@/models/Url";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { originalUrl, expiresInDays } = await req.json();

    if (!originalUrl) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    await connectToDB();

    const shortId = nanoid(7);

    const existing = await Url.findOne({ originalUrl });
    if (existing) {
      return NextResponse.json({
        shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${existing.shortId}`,
        clicks: existing.clicks,
      });
    }

    const expiresAt =
      expiresInDays && expiresInDays > 0
        ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
        : undefined;

    const newUrl = await Url.create({
      originalUrl,
      shortId,
      expiresAt,
    });

    return NextResponse.json({
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${newUrl.shortId}`,
      clicks: newUrl.clicks,
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
