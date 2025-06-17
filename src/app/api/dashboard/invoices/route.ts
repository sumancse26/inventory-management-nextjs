import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

type productType = {
  product_id: number;
  qty: number;
  sale_price: number;
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
    const body = await req.json();
    const vatAmount = (Number(body.total) * Number(body.vat_pct)) / 100;
    const totalPayable = (
      Number(body.total) +
      vatAmount -
      Number(body.discount)
    ).toString();

    await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoices.create({
        data: {
          user_id: Number(userId),
          customer_id: Number(body.customer_id),
          total: body.total.toString(),
          discount: body.discount.toString(),
          vat_pct: Number(body.vat_pct),
          vat_amount: vatAmount,
          payable: totalPayable.toString(),
        },
      });

      const products = body.products.map((item: productType) => {
        return {
          invoice_id: invoice.id,
          product_id: item.product_id,
          user_id: Number(userId),
          qty: item.qty.toString(),
          sale_price: item.sale_price.toString(),
        };
      });

      const invoiceProducts = await tx.invoice_products.createMany({
        data: products,
      });

      return { invoice, invoiceProducts };
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
