import prisma from '@/config/prisma';
import { generateProductCode } from '@/utils';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = async (req) => {
    try {
        const userId = req.headers.get('user_id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 400 });
        }

        const products = await prisma.products.findMany({
            where: {
                user_id: Number(userId)
            },
            select: {
                id: true,
                category_id: true,
                name: true,
                prod_code: true,
                mrp: true,
                stock: true,
                unit_price: true,
                trade_price: true,
                vat_pct: true,
                uom: true,
                uom_name: true,
                img_url: true,
                discount: true
            },
            orderBy: {
                id: 'desc'
            }
        });
        return NextResponse.json({ message: 'Fetched successfully', success: true, data: products }, { status: 200 });
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

export const POST = async (req) => {
    try {
        const userId = req.headers.get('user_id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 400 });
        }

        const formData = await req.json();

        const { category_id, name, image, prod_code, price, stock, mrp, vat_pct, uom, uom_name, discount } = formData;

        const tradePrice = (Number(price) * Number(vat_pct)) / 100 + Number(price) || 0;
        const prodCode = await generateProductCode(name);
        if (!name || !price || !stock || !uom || !vat_pct || !mrp || isNaN(category_id)) {
            return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
        }

        const product = await prisma.products.create({
            data: {
                user_id: Number(userId),
                category_id: Number(category_id),
                name,
                prod_code: prod_code || prodCode,
                trade_price: Number(tradePrice),
                stock: Number(stock),
                unit_price: Number(price),
                mrp: Number(mrp),
                vat_pct: Number(vat_pct),
                uom: Number(uom),
                uom_name,
                discount: Number(discount),
                img_url: image
            },
            select: {
                id: true,
                name: true
            }
        });

        return NextResponse.json({ message: 'Upload successful', success: true, data: product }, { status: 200 });
    } catch (err) {
        console.error('Image upload error:', err);
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

export const PUT = async (req) => {
    try {
        const userId = req.headers.get('user_id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 400 });
        }

        const formData = await req.json();

        if (isNaN(formData.id)) {
            return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
        }

        const existingProduct = await prisma.products.findFirst({
            where: {
                id: Number(formData.id),
                user_id: Number(userId)
            }
        });

        if (!existingProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const { category_id, name, image, prod_code, price, stock, mrp, vat_pct, uom, uom_name, discount } =
            await formData;

        const tradePrice = (Number(price) * Number(vat_pct)) / 100 + Number(price) || 0;

        if (!name || !price || !stock || !uom || !vat_pct || !mrp || isNaN(category_id)) {
            return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
        }

        const updatedProduct = await prisma.products.update({
            where: {
                id: Number(formData.id),
                user_id: Number(userId)
            },
            data: {
                name: name,
                prod_code: prod_code,
                trade_price: Number(tradePrice),
                stock: Number(stock),
                unit_price: Number(price),
                mrp: Number(mrp),
                vat_pct: Number(vat_pct),
                uom: Number(uom),
                uom_name,
                discount: Number(discount),
                category_id: Number(category_id),
                img_url: image
            },
            select: {
                id: true,
                name: true
            }
        });

        return NextResponse.json(
            { message: 'Update successful', success: true, data: updatedProduct },
            { status: 200 }
        );
    } catch (err) {
        console.error('Image update error:', err);
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

export const DELETE = async (req) => {
    try {
        const userId = req.headers.get('user_id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 400 });
        }
        const body = await req.json();
        await prisma.products.delete({
            where: {
                id: Number(body.id),
                user_id: Number(userId)
            }
        });
        return NextResponse.json({ message: 'Product Deleted successfully', success: true }, { status: 200 });
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
