import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const userId = req.headers.get("user_id");
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const customer = await prisma.customers.findFirst({
      where: {
        user_id: Number(userId),
        email: body.email,
      },
    });

    if (customer) {
      return NextResponse.json(
        { message: "Customer already exists" },
        { status: 400 }
      );
    }

    const data = await prisma.customers.create({
      data: {
        name: body.name,
        email: body.email,
        mobile: body.mobile,
        user_id: Number(userId),
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
      },
    });
    return NextResponse.json({ message: "Success", data }, { status: 200 });
  } catch (err) {
    console.log(err);
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
    const body = await req.json();
    const customer = await prisma.customers.update({
      where: {
        id: Number(body.id),
        user_id: Number(userId),
      },
      data: {
        name: body.name,
        email: body.email,
        mobile: body.mobile,
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
      },
    });
    return NextResponse.json(
      { message: "Success", data: customer },
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

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const userId = req.headers.get("user_id");
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 400 }
      );
    }
    const customers = await prisma.customers.findMany({
      where: {
        user_id: Number(userId),
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
      },
    });
    return NextResponse.json(
      { message: "Success", data: customers },
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
    await prisma.customers.delete({
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
