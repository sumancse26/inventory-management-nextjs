import prisma from "@/config/prisma";
import { decryptPassword, jwtEncode } from "@/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
interface loginInfo {
  email: string;
  password: string;
}

interface jwtPayload {
  name: string;
  email: string;
  user_id: number | string;
  role: string;
}

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const data: loginInfo = await req.json();
    if (!data.email || !data.password) {
      return NextResponse.json(
        { message: "Please enter email and password" },
        { status: 400 }
      );
    }

    const selectedUser = await prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!selectedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const decryptedPassword = await decryptPassword(
      data.password,
      selectedUser.password
    );

    if (!decryptedPassword) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 400 }
      );
    }

    const payload: jwtPayload = {
      name: selectedUser.first_name,
      email: selectedUser.email,
      user_id: selectedUser.id,
      role: "",
    };
    const token = await jwtEncode(payload);

    //setting cookie in server side
    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: token,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      path: "/",
    });

    return NextResponse.json({
      message: "Login successful",
      data: {
        id: selectedUser.id,
        name: `${selectedUser.first_name} ${selectedUser.last_name}`,
        email: selectedUser.email,
      },
      token,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    } else {
      return NextResponse.json("Internal server error", { status: 500 });
    }
  }
};
