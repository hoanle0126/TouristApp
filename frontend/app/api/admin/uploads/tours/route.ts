import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

const uploadDirectory = path.join(process.cwd(), "public", "uploads", "tours");
const allowedImageTypes = new Map([
  ["image/avif", ".avif"],
  ["image/gif", ".gif"],
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);
const maxFileSize = 5 * 1024 * 1024;

function slugifyFilePart(value: string) {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "tour-image";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  const extension = allowedImageTypes.get(file.type);

  if (!extension) {
    return NextResponse.json({ error: "Only AVIF, GIF, JPG, PNG, and WEBP images are allowed." }, { status: 400 });
  }

  if (file.size > maxFileSize) {
    return NextResponse.json({ error: "Image must be 5MB or smaller." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const fileName = `${Date.now()}-${crypto.randomUUID()}-${slugifyFilePart(file.name)}${extension}`;
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(path.join(uploadDirectory, fileName), Buffer.from(bytes));

  return NextResponse.json({ url: `/uploads/tours/${fileName}` });
}
