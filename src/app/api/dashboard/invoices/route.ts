import prisma from '@/config/prisma';
import { NextRequest, NextResponse } from 'next/server';

type productType = {
    product_id: number;
    qty: number;
    sale_price: number;
    discount: number;
    item_total: number;
    vat_pct: number;
};

type userType = {
    role: number;
} | null;

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get('user_id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 401 });
        }

        const user: userType | null = await prisma.users.findFirst({
            where: { id: Number(userId) },
            select: {
                role: true,
                id: true
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found', success: false }, { status: 404 });
        }

        if (user && user?.role == 1) {
            const invoices = await prisma.invoices.findMany({
                select: {
                    id: true,
                    customer_id: true,
                    discount: true,
                    vat_amount: true,
                    payable: true,
                    user: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                }
            });

            return NextResponse.json({ message: 'Success', success: true, data: invoices }, { status: 200 });
        } else {
            const invoices = await prisma.invoices.findMany({
                where: {
                    user_id: Number(userId)
                },
                select: {
                    id: true,
                    customer_id: true,
                    discount: true,
                    vat_amount: true,
                    payable: true,
                    user: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                }
            });

            return NextResponse.json({ message: 'Success', success: true, data: invoices }, { status: 200 });
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get('user_id');

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 400 });
        }

        const body = await req.json();

        const subTotal = () => {
            return body.products.reduce(
                (total: number, item: productType) => total + Number(item.qty || 0) * Number(item.sale_price || 0),
                0
            );
        };
        const total = subTotal();

        const discountTotal = () => {
            if (body.is_gross_total) {
                return body.discount;
            } else {
                return body.products.reduce((total: number, item: productType) => {
                    return total + Number(item.discount || 0) || 0;
                }, 0);
            }
        };
        const totalDiscount = discountTotal();

        const totalVat = () => {
            return body.products.reduce((total: number, item: productType) => {
                return total + ((Number(item.item_total) * Number(item.vat_pct)) / 100 || 0);
            }, 0);
        };
        const totalVatAmount = totalVat();

        const totalPayable = (Number(total) + Number(totalVatAmount) - Number(totalDiscount))?.toString();

        await prisma.$transaction(async (tx) => {
            const invoice = await tx.invoices.create({
                data: {
                    user_id: Number(userId),
                    customer_id: Number(body.customer_id),
                    total: total?.toString(),
                    discount: totalDiscount?.toString(),
                    vat_amount: totalVatAmount,
                    payable: totalPayable
                }
            });

            const products = body.products.map((item: productType) => {
                return {
                    invoice_id: invoice.id,
                    product_id: item.product_id,
                    user_id: Number(userId),
                    qty: item.qty?.toString(),
                    sale_price: item.sale_price?.toString()
                };
            });

            const invoiceProducts = await tx.invoice_products.createMany({
                data: products
            });

            return { invoice, invoiceProducts };
        });

        return NextResponse.json({ message: 'Invoice saved successfully', success: true }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            {
                error: 'Internal server error',
                success: false,
                message: 'Internal server error'
            },
            { status: 500 }
        );
    }
};

export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get('user_id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 400 });
        }
        const body = await req.json();
        const invId = Number(body.invoice_id);

        await prisma.$transaction(async (tx) => {
            const deletedProducts = await tx.invoice_products.deleteMany({
                where: {
                    invoice_id: invId,
                    user_id: Number(userId)
                }
            });

            const deletedInv = await tx.invoices.delete({
                where: {
                    id: invId,
                    user_id: Number(userId)
                }
            });

            return {
                deletedProducts,
                deletedInv
            };
        });

        return NextResponse.json({ message: 'Invoice deleted successfully', success: true }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            {
                error: 'Internal server error',
                success: false,
                message: 'Internal server error'
            },
            { status: 500 }
        );
    }
};
