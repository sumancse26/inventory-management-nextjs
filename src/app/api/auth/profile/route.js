import prisma from '@/config/prisma';
import { NextResponse } from 'next/server';

// import { Readable } from 'stream';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const POST = async (req) => {
    try {
        const userId = req.headers.get('user_id');

        const user = await prisma.users.findUnique({
            where: { id: Number(userId) }
        });
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized user' }, { status: 401 });
        }

        const postData = await req.json();
        const { first_name, last_name, email, mobile, image } = postData;

        await prisma.users.update({
            where: {
                id: user.id
            },
            data: {
                image: image || user.image,
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

export const GET = async (req) => {
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
