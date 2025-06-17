import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

type productType = {
  product_id: number;
  qty: number;
  sale_price: number;
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
    const invoices = await prisma.invoices.findMany({
      where: {
        user_id: Number(userId),
      },
      select: {
        id: true,
        customer_id: true,
        total: true,
        discount: true,
        vat_pct: true,
        vat_amount: true,
        payable: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(
      { message: "Success", data: invoices },
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

//update will be done in future
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
    const invId = Number(body.invoice_id);

    await prisma.$transaction(async (tx) => {
      const deletedProducts = await tx.invoice_products.deleteMany({
        where: {
          invoice_id: invId,
          user_id: Number(userId),
        },
      });

      const deletedInv = await tx.invoices.delete({
        where: {
          id: invId,
          user_id: Number(userId),
        },
      });

      return {
        deletedProducts,
        deletedInv,
      };
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
