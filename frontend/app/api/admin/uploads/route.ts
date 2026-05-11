import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const UPLOAD_DIRECTORY = path.join(process.cwd(), "public", "static", "uploads", "tours");

const IMAGE_EXTENSIONS = {
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return errorResponse("Image file is required.", 400);
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return errorResponse("Image must be 5MB or smaller.", 413);
    }

    const extension = IMAGE_EXTENSIONS[file.type as keyof typeof IMAGE_EXTENSIONS];

    if (!extension) {
      return errorResponse("Image must be JPG, PNG, WebP, or GIF.", 400);
    }

    const filename = `tour-${Date.now()}-${randomUUID()}.${extension}`;
    const filePath = path.join(UPLOAD_DIRECTORY, filename);
    const buffer = Buffer.from(await file.arrayBuffer());

    await mkdir(UPLOAD_DIRECTORY, { recursive: true });
    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/static/uploads/tours/${filename}` });
  } catch {
    return errorResponse("Unable to save image. Please try again.", 500);
  }
}
