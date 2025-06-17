import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: Promise<{ params: { id: string } }>
): Promise<NextResponse> => {
  try {
    const { params } = await context;
    const { id } = await params;

    const userId = req.headers.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 400 }
      );
    }

    const customerId = Number(req.nextUrl.searchParams.get("customer_id")) || 0;

    const customerDetail = await prisma.customers.findFirst({
      where: {
        user_id: Number(userId),
        id: Number(customerId), // or req.body.cus_id depending on your route method
      },
    });

    const invoiceTotal = await prisma.invoices.findFirst({
      where: {
        user_id: Number(userId),
        id: Number(id),
      },
    });

    const invoiceProduct = await prisma.invoice_products.findMany({
      where: {
        user_id: Number(userId),
        invoice_id: Number(id),
      },
      include: {
        product: true, // Assumes relation `product` is defined in your schema
      },
    });

    return NextResponse.json(
      {
        message: "Success",
        customers: customerDetail,
        invoices: invoiceTotal,
        invoiceProducts: invoiceProduct,
      },
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
