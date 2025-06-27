import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const userId = req.headers.get("user_id");
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 400 }
      );
    }

    const totalUsers = await prisma.users.count({});
    const totalProducts = await prisma.products.count({});
    const invoices = await prisma.invoices.findMany({
      select: {
        payable: true,
      },
    });
    const totalSale = invoices.reduce((sum, inv) => {
      const value = parseFloat(inv.payable);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);

    const data = {
      total_users: totalUsers,
      total_products: totalProducts,
      total_invoices: invoices?.length || 0,
      total_sale: totalSale,
      total_collection: totalSale,
    };
    return NextResponse.json(
      { message: "Fetched successfully", success: true, data },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
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
