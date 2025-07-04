/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@/config/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const GET = async (req: NextRequest, { params }: any) => {
    try {
        const { id } = params;
        const userId = req.headers.get('user_id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 401 });
        }

        const productId = Number(id);
        if (isNaN(productId)) {
            return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
        }

        const product = await prisma.products.findFirst({
            where: {
                id: productId,
                user_id: Number(userId)
            },
            select: {
                id: true,
                category_id: true,
                name: true,
                mrp: true,
                stock: true,
                img_url: true
            }
        });

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Success', data: product }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};
