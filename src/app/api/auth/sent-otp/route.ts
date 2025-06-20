import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

type otpType = {
  otp: string;
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body: otpType = await req.json();

    const userId = req.headers.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 400 }
      );
    }

    if (!body.otp) {
      return NextResponse.json({ message: "Otp is required" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await prisma.users.update({
      where: { id: Number(user.id) },
      data: {
        otp: body.otp?.toString(),
      },
    });

    return NextResponse.json({ message: "Success" }, { status: 200 });
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
