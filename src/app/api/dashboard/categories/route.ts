import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

type CategoryBody = {
  name: string;
  user_id: number;
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body: CategoryBody = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const category = await prisma.categories.create({
      data: {
        name: body.name,
        user_id: body.user_id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(
      { message: "Success", data: category },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(String(error));
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
