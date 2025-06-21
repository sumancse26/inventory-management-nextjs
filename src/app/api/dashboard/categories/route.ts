import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

type CategoryBody = {
  name: string;
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body: CategoryBody = await req.json();
    const userId = req.headers.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 400 }
      );
    }

    if (!body.name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const category = await prisma.categories.create({
      data: {
        name: body.name,
        user_id: Number(userId),
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(
      { message: "Category Created", success: true, data: category },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(String(error));
    }
    return NextResponse.json(
      {
        error: "Internal server error",
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const userId = req.headers.get("user_id");
    const categories = await prisma.categories.findMany({
      where: {
        user_id: Number(userId),
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(
      {
        message: "Category fetched successfully",
        success: true,
        data: categories,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Internal server error",
        success: false,
      },
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
    const body = await req.json();
    const category = await prisma.categories.update({
      where: {
        id: Number(body.id),
        user_id: Number(userId),
      },
      data: {
        name: body.name,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return NextResponse.json(
      { message: "Category updated", success: true, data: category },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      error: "Internal server error",
      status: 500,
      success: false,
    });
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
    await prisma.categories.delete({
      where: {
        id: Number(body.id),
        user_id: Number(userId),
      },
    });
    return NextResponse.json(
      { message: "Category deleted", success: true },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      error: "Internal server error",
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};
