import prisma from "@/config/prisma";
import { existsSync } from "fs";
import { mkdir, unlink, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const userId = req.headers.get("user_id");
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024;
    if (image.size > maxSize) {
      return NextResponse.json(
        { error: "Image must be less than 5MB" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { error: "Invalid image type" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const timestamp = Date.now();
    const ext = path.extname(image.name);
    const baseName = path
      .basename(image.name, ext)
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .toLowerCase();
    const fileName = `${baseName}_${timestamp}${ext}`;

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const fullPath = path.join(uploadDir, fileName);
    await writeFile(fullPath, buffer);
    const fileUrl = `/uploads/${fileName}`;

    const name = formData.get("name")?.toString() || "";
    const price = formData.get("price")?.toString() || "";
    const unit = formData.get("unit")?.toString() || "";
    const categoryId = Number(formData.get("category_id"));

    if (!name || !price || !unit || isNaN(categoryId)) {
      // Clean up uploaded file on bad input
      await unlink(fullPath);
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.products.create({
        data: {
          name,
          price,
          unit,
          category_id: categoryId,
          user_id: Number(userId),
          img_url: fileUrl,
        },
        select: {
          id: true,
          name: true,
          price: true,
          unit: true,
          category_id: true,
          img_url: true,
        },
      });
      return product;
    });

    return NextResponse.json(
      { message: "Upload successful", data: result },
      { status: 200 }
    );
  } catch (err) {
    console.error("Image upload error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
