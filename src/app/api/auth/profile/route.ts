import prisma from '@/config/prisma';
import { existsSync } from 'fs';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get('user_id');

        const user = await prisma.users.findUnique({
            where: { id: Number(userId) }
        });
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 401 });
        }

        const formData = await req.formData();
        const image = formData.get('image') as File;
        let fileUrl = '';
        let fullPath = '';

        if (image) {
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

        const first_name = formData.get('first_name')?.toString() || '';
        const last_name = formData.get('last_name')?.toString() || '';
        const email = formData.get('email')?.toString() || '';
        const mobile = formData.get('mobile')?.toString() || '';

        if (!first_name || !last_name || !email || !mobile) {
            // Clean up uploaded file on bad input
            await unlink(fullPath);
            return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
        }

        await prisma.users.update({
            where: {
                id: user.id
            },
            data: {
                image: fileUrl || user.image,
                first_name: first_name || user.first_name,
                last_name: last_name || user.last_name,
                email: email || user.email,
                mobile: mobile || user.mobile,
                otp: user.otp,
                password: user.password
            }
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Profile updated successfully'
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get('user_id');

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 401 });
        }
        const user = await prisma.users.findUnique({
            where: { id: Number(userId) },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                mobile: true,
                image: true
            }
        });

        return NextResponse.json(
            {
                success: true,
                message: 'User profile fetched successfully',
                user
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
};
