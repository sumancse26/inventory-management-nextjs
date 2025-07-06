import prisma from '@/config/prisma';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export const GET = async (req) => {
    try {
        const userId = req.headers.get('user_id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 400 });
        }

        const totalUsers = await prisma.users.count({});
        const totalProducts = await prisma.products.count({});
        const invoices = await prisma.invoices.findMany({
            select: {
                payable: true,
                collection_amount: true
            }
        });
        const totalSale = invoices.reduce((sum, inv) => {
            const value = parseFloat(inv.payable);
            return sum + (isNaN(value) ? 0 : value);
        }, 0);
        const totalCollection = invoices.reduce((sum, inv) => {
            const value = parseFloat(inv.collection_amount?.toString() || '0');
            return sum + (isNaN(value) ? 0 : value);
        }, 0);

        const data = {
            total_users: totalUsers,
            total_products: totalProducts,
            total_invoices: invoices?.length || 0,
            total_sale: totalSale,
            total_collection: totalCollection
        };
        return NextResponse.json({ message: 'Fetched successfully', success: true, data }, { status: 200 });
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
