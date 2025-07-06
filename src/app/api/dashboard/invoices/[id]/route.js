import prisma from '@/config/prisma';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const GET = async (req, { params }) => {
    try {
        const { id } = params;

        const userId = req.headers.get('user_id');

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 400 });
        }

        const invoiceInfo = await prisma.invoices.findFirst({
            where: {
                user_id: Number(userId),
                id: Number(id)
            },
            include: {
                customer: true,
                invoice_products: true
            }
        });

        return NextResponse.json(
            {
                message: 'Success',
                success: true,
                invoiceInfo
            },
            { status: 200 }
        );
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
