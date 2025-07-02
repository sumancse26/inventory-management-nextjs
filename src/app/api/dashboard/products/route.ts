import prisma from '@/config/prisma';
import { generateProductCode } from '@/utils';
import { existsSync } from 'fs';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest): Promise<NextResponse> => {
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

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get('user_id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 400 });
        }

        const formData = await req.formData();
        const image = formData.get('image') as File;
        let fileUrl = '';
        let fullPath = '';
        const prodCode = await generateProductCode(formData.get('name')?.toString() || '');

        if (image && typeof image == 'object' && 'size' in image && image.size > 0) {
            const maxSize = 5 * 1024 * 1024;
            if (image.size > maxSize) {
                return NextResponse.json({ error: 'Image must be less than 5MB' }, { status: 400 });
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
            if (!allowedTypes.includes(image.type)) {
                return NextResponse.json({ error: 'Invalid image type' }, { status: 400 });
            }

            const buffer = Buffer.from(await image.arrayBuffer());
            const timestamp = Date.now();
            const ext = path.extname(image.name);
            const baseName = path
                .basename(image.name, ext)
                .replace(/\s+/g, '_')
                .replace(/[^a-zA-Z0-9_-]/g, '')
                .toLowerCase();
            const fileName = `${baseName}_${timestamp}${ext}`;

            const uploadDir = path.join(process.cwd(), 'public/uploads');
            if (!existsSync(uploadDir)) {
                await mkdir(uploadDir, { recursive: true });
            }

            fullPath = path.join(uploadDir, fileName);
            await writeFile(fullPath, buffer);
            fileUrl = `/uploads/${fileName}`;
        }

        const categoryId = Number(formData.get('category_id'));
        const name = formData.get('name')?.toString() || '';
        const prod_code = formData.get('prod_code')?.toString() || prodCode;
        const unitPrice = formData.get('price')?.toString() || '';
        const stock = formData.get('stock') || 0;
        const mrp = formData.get('mrp')?.toString() || '';
        const vat_pct = formData.get('vat_pct') || 0;
        const uom = formData.get('uom') || 0;
        const uom_name = formData.get('uom_name')?.toString() || 'Pcs';
        const discount = formData.get('discount') || 0;

        const tradePrice = (Number(unitPrice) * Number(vat_pct)) / 100 + Number(unitPrice) || 0;

        if (!name || !unitPrice || !stock || !uom || isNaN(categoryId)) {
            // Clean up uploaded file on bad input
            await unlink(fullPath);
            return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            const product = await tx.products.create({
                data: {
                    user_id: Number(userId),
                    category_id: categoryId,
                    name,
                    prod_code,
                    trade_price: tradePrice,
                    stock: Number(stock),
                    unit_price: Number(unitPrice),
                    mrp: Number(mrp),
                    vat_pct: Number(vat_pct),
                    uom: Number(uom),
                    uom_name,
                    discount: Number(discount),
                    img_url: fileUrl
                },
                select: {
                    id: true,
                    name: true
                }
            });
            return product;
        });

        return NextResponse.json({ message: 'Upload successful', success: true, data: result }, { status: 200 });
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

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get('user_id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 400 });
        }

        const formData = await req.formData();

        const image = formData.get('image') as File;

        const productId = Number(formData.get('id'));
        if (isNaN(productId)) {
            return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
        }

        const existingProduct = await prisma.products.findFirst({
            where: {
                id: productId,
                user_id: Number(userId)
            }
        });

        if (!existingProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        let fileUrl = existingProduct.img_url;

        if (image && typeof image == 'object' && 'size' in image && image.size > 0) {
            const maxSize = 5 * 1024 * 1024;
            if (image.size > maxSize) {
                return NextResponse.json({ error: 'Image must be less than 5MB' }, { status: 400 });
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
            console.log('kkkk', image.type);
            if (!allowedTypes.includes(image.type)) {
                return NextResponse.json({ error: 'Invalid image type' }, { status: 400 });
            }

            // Delete old image
            if (existingProduct.img_url) {
                const oldPath = path.join(process.cwd(), 'public', existingProduct.img_url);
                try {
                    if (existsSync(oldPath)) {
                        await unlink(oldPath);
                    }
                } catch (err) {
                    console.warn('Failed to delete old image:', err);
                }
            }

            // Save new image
            const buffer = Buffer.from(await image.arrayBuffer());
            const timestamp = Date.now();
            const ext = path.extname(image.name);
            const baseName = path
                .basename(image.name, ext)
                .replace(/\s+/g, '_')
                .replace(/[^a-zA-Z0-9_-]/g, '')
                .toLowerCase();
            const fileName = `${baseName}_${timestamp}${ext}`;

            const uploadDir = path.join(process.cwd(), 'public/uploads');
            await mkdir(uploadDir, { recursive: true });

            const fullPath = path.join(uploadDir, fileName);
            await writeFile(fullPath, buffer);

            fileUrl = `/uploads/${fileName}`;
        }

        const categoryId = Number(formData.get('category_id'));
        const name = formData.get('name')?.toString() || '';
        const prodCode = formData.get('prod_code')?.toString() || '';
        const unitPrice = formData.get('price')?.toString() || '';
        const stock = formData.get('stock') || 0;
        const mrp = formData.get('mrp')?.toString() || '';
        const vat_pct = formData.get('vat_pct') || 0;
        const uom = formData.get('uom') || 0;
        const uom_name = formData.get('uom_name')?.toString() || 'PC';
        const discount = formData.get('discount') || 0;
        const tradePrice = (Number(unitPrice) * Number(vat_pct)) / 100 + Number(unitPrice) || 0;

        if (!name || !unitPrice || !stock || !uom || isNaN(categoryId)) {
            return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
        }

        const updatedProduct = await prisma.products.update({
            where: {
                id: productId,
                user_id: Number(userId)
            },
            data: {
                name,
                prod_code: prodCode,
                trade_price: Number(tradePrice),
                stock: Number(stock),
                unit_price: Number(unitPrice),
                mrp: Number(mrp),
                vat_pct: Number(vat_pct),
                uom: Number(uom),
                uom_name,
                discount: Number(discount),
                category_id: categoryId,
                img_url: fileUrl
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

export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
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
