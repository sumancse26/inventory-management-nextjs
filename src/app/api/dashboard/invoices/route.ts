import prisma from '@/config/prisma';
import { generateInvoiceNumber } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';

type productType = {
    product_id: number;
    qty: number;
    sale_price: number;
    discount: number;
    item_total: number;
    vat_pct: number;
    product_name: string;
    payable: string;
    product_code: string;
    unit_price: number;
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
                    status: true,
                    inv_no: true,
                    collection_type: true,
                    collection_amount: true,
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
                    status: true,
                    inv_no: true,
                    collection_type: true,
                    collection_amount: true,
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
                return total + ((Number(item.unit_price) * Number(item.vat_pct) * Number(item.qty)) / 100 || 0);
            }, 0);
        };
        const totalVatAmount = totalVat();

        const totalPayable = (Number(total) - Number(totalDiscount))?.toString(); //if vat included with product
        // const totalPayable = (Number(total) + Number(totalVatAmount) - Number(totalDiscount))?.toString();
        const invoiceNumber = await generateInvoiceNumber();

        await prisma.$transaction(async (tx) => {
            const invoice = await tx.invoices.create({
                data: {
                    user_id: Number(userId),
                    customer_id: Number(body.customer_id),
                    total: total?.toString(),
                    discount: totalDiscount?.toString(),
                    vat_amount: totalVatAmount,
                    payable: totalPayable,
                    inv_no: invoiceNumber
                }
            });

            const products = body.products.map((item: productType) => {
                return {
                    invoice_id: invoice.id,
                    product_id: item.product_id,
                    user_id: Number(userId),
                    qty: item.qty?.toString(),
                    sale_price: item.sale_price?.toString(),
                    product_name: item.product_name,
                    product_code: item.product_code
                };
            });

            await tx.invoice_products.createMany({ data: products });

            // Update stock from products table
            const stockProducts = products.map((p: productType) => p.product_id);
            const dbProducts = await tx.products.findMany({
                where: {
                    id: { in: stockProducts }
                },
                select: {
                    id: true,
                    stock: true
                }
            });

            const updatedProducts = dbProducts.map((p) => {
                const product = products.find((ip: productType) => ip.product_id == p.id);
                return {
                    id: p.id,
                    stock: Number(p.stock) - Number(product?.qty || 0)
                };
            });

            // ✅ Apply the stock updates
            await Promise.all(
                updatedProducts.map((p) =>
                    tx.products.update({
                        where: { id: p.id },
                        data: { stock: Number(p.stock) }
                    })
                )
            );

            return { invoice };
        });

        return NextResponse.json({ message: 'Order placed successfully', success: true }, { status: 200 });
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

        if (!invId) {
            return NextResponse.json({ message: 'Invoice id is required' }, { status: 400 });
        }

        await prisma.invoices.update({
            where: { id: invId },
            data: { status: 0 }
        });

        // await prisma.$transaction(async (tx) => {
        //     const deletedProducts = await tx.invoice_products.deleteMany({
        //         where: {
        //             invoice_id: invId,
        //             user_id: Number(userId)
        //         }
        //     });

        //     const deletedInv = await tx.invoices.delete({
        //         where: {
        //             id: invId,
        //             user_id: Number(userId)
        //         }
        //     });

        //     return {
        //         deletedProducts,
        //         deletedInv
        //     };
        // });

        return NextResponse.json({ message: 'Order canceled successfully', success: true }, { status: 200 });
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

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get('user_id');

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 400 });
        }

        const body = await req.json();

        const invItem = await prisma.invoices.findUnique({
            where: {
                id: Number(body.invoice_id),
                user_id: Number(userId)
            }
        });

        const collectionAmt = Number(invItem?.collection_amount || 0) + Number(body.collection_amount || 0);

        const collectionType = Number(invItem?.payable || 0) <= collectionAmt ? 'full' : 'partial';

        await prisma.invoices.update({
            where: {
                id: Number(body.invoice_id),
                user_id: Number(userId)
            },
            data: {
                status: collectionType == 'full' ? 2 : 1,
                collection_amount: Number(invItem?.collection_amount || 0) + Number(body.collection_amount),
                collection_type: collectionType
            }
        });

        return NextResponse.json({ message: 'Collection placed successfully', success: true }, { status: 200 });
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
