import prisma from "@/config/prisma";
import { existsSync } from "fs";
import { mkdir, unlink, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const userId = req.headers.get("user_id");
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 400 }
      );
    }
    const products = await prisma.products.findMany({
      where: {
        user_id: Number(userId),
      },
      select: {
        id: true,
        category_id: true,
        name: true,
        price: true,
        qty: true,
        img_url: true,
      },
    });
    return NextResponse.json(
      { message: "Success", data: products },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

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
    const qty = formData.get("qty") || 0;
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
          qty: Number(qty),
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

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
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

    const productId = Number(formData.get("id"));
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.products.findFirst({
      where: {
        id: productId,
        user_id: Number(userId),
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let fileUrl = existingProduct.img_url;

    if (image) {
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

      // Delete old image
      if (existingProduct.img_url) {
        const oldPath = path.join(
          process.cwd(),
          "public",
          existingProduct.img_url
        );
        try {
          if (existsSync(oldPath)) {
            await unlink(oldPath);
          }
        } catch (err) {
          console.warn("Failed to delete old image:", err);
        }
      }

      // Save new image
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
      await mkdir(uploadDir, { recursive: true });

      const fullPath = path.join(uploadDir, fileName);
      await writeFile(fullPath, buffer);

      fileUrl = `/uploads/${fileName}`;
    }

    const name = formData.get("name")?.toString() || "";
    const price = formData.get("price")?.toString() || "";
    const qty = Number(formData.get("qty")) || 0;
    const unit = formData.get("unit")?.toString() || "";
    const categoryId = Number(formData.get("category_id"));

    if (!name || !price || !unit || isNaN(categoryId)) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.products.update({
      where: {
        id: productId,
        user_id: Number(userId),
      },
      data: {
        name,
        price,
        unit,
        qty,
        category_id: categoryId,
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

    return NextResponse.json(
      { message: "Update successful", data: updatedProduct },
      { status: 200 }
    );
  } catch (err) {
    console.error("Image update error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const userId = req.headers.get("user_id");
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 400 }
      );
    }
    const body = await req.json();
    await prisma.products.delete({
      where: {
        id: Number(body.id),
        user_id: Number(userId),
      },
    });
    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
